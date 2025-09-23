import { useReducer, useEffect, useRef } from 'react';
import { PriorityQueue } from '../ds/PriorityQueue';
import toast from 'react-hot-toast';

// --- INITIAL STATE ---
const initialState = {
  originalJobs: [],
  jobs: [],
  algorithm: 'FCFS',
  timeQuantum: 4,
  isSimulating: false,
  isPaused: false,
  currentTime: 0,
  simulationSpeed: 450,
  readyQueue: [],
  timeline: [],
  finishedJobsCount: 0,
  metrics: null,
};

// --- REDUCER ---
// Replace the entire schedulerReducer function with this corrected version

function schedulerReducer(state, action) {
    switch (action.type) {
      case 'ADD_JOB': {
        const newJob = { 
          ...action.payload, 
          id: Date.now(), 
          name: `Job ${state.originalJobs.length + 1}`,
          arrival: 0,
        };
        return { ...state, originalJobs: [...state.originalJobs, newJob] };
      }
      case 'SETUP_SIMULATION': {
        const jobsToRun = JSON.parse(JSON.stringify(state.originalJobs)).map(j => ({
          ...j,
          remainingTime: j.burst,
          state: 'idle',
          waitingTime: 0,
          turnaroundTime: 0,
          completionTime: -1,
        }));
        return {
          ...state,
          jobs: jobsToRun,
          isSimulating: true,
          isPaused: false,
          currentTime: 0,
          timeline: [],
          metrics: null,
          readyQueue: [],
          finishedJobsCount: 0,
          algorithm: action.payload.algorithm,
          timeQuantum: action.payload.timeQuantum,
        };
      }
      case 'PAUSE_SIMULATION': return { ...state, isPaused: true };
      case 'RESUME_SIMULATION': return { ...state, isPaused: false };
      case 'SET_SPEED': return { ...state, simulationSpeed: action.payload };
  
      case 'TICK': {
        if (!state.isSimulating || state.isPaused) return state;
  
        let { jobs, timeline, finishedJobsCount, currentTime, algorithm, timeQuantum, timeQuantumLeft } = state;
        
        jobs = JSON.parse(JSON.stringify(jobs));
        timeline = [...timeline];
        
        let readyQueue;
        let currentJob = jobs.find(j => j.state === 'running') || null;
  
        if (algorithm === 'SRTF' || algorithm === 'PRIORITY') {
          readyQueue = new PriorityQueue();
          jobs.filter(j => j.state === 'ready').forEach(j => {
            const compareKey = algorithm === 'SRTF' ? j.remainingTime : j.priority;
            readyQueue.insert({ ...j, compareKey });
          });
        } else {
          readyQueue = jobs.filter(j => j.state === 'ready').sort((a,b) => a.arrival - b.arrival);
        }
        
        if (typeof timeQuantumLeft === 'undefined') {
          timeQuantumLeft = timeQuantum;
        }
        
        jobs.filter(j => j.state === 'idle' && j.arrival <= currentTime).forEach(j => {
          const allDepsFinished = j.dependencies.every(depId => jobs.find(job => job.id === depId)?.state === 'finished');
          if (allDepsFinished) {
            j.state = 'ready';
            if (algorithm === 'SRTF') readyQueue.insert({ ...j, compareKey: j.remainingTime });
            else if (algorithm === 'PRIORITY') readyQueue.insert({ ...j, compareKey: j.priority });
            else readyQueue.push(j);
          }
        });
        
        if ((algorithm === 'SRTF' || algorithm === 'PRIORITY') && !readyQueue.isEmpty()) {
          const nextJobInQueue = readyQueue.peek();
          if (currentJob) {
            const compareKeyCurrent = algorithm === 'SRTF' ? currentJob.remainingTime : currentJob.priority;
            if (nextJobInQueue.compareKey < compareKeyCurrent) {
              const preemptedJob = jobs.find(j => j.id === currentJob.id);
              preemptedJob.state = 'ready';
              const compareKeyPreempted = algorithm === 'SRTF' ? preemptedJob.remainingTime : preemptedJob.priority;
              readyQueue.insert({ ...preemptedJob, compareKey: compareKeyPreempted });
              currentJob = null;
            }
          }
        }
  
        // --- THIS IS THE CORRECTED LOGIC ---
        const isQueueNotEmpty = Array.isArray(readyQueue) ? readyQueue.length > 0 : !readyQueue.isEmpty();
        
        if (currentJob === null && isQueueNotEmpty) {
          let nextJobData;
          if (Array.isArray(readyQueue)) {
            nextJobData = readyQueue.shift();
          } else {
            nextJobData = readyQueue.extractMin();
          }
          
          currentJob = jobs.find(j => j.id === nextJobData.id);
          if (currentJob) {
            currentJob.state = 'running';
            timeQuantumLeft = timeQuantum;
          }
        }
        // --- END OF CORRECTION ---
        
        if (currentJob) {
          const lastEntry = timeline[timeline.length - 1];
          if (!lastEntry || lastEntry.jobId !== currentJob.id || lastEntry.end !== currentTime) {
            timeline.push({ jobId: currentJob.id, jobName: currentJob.name, start: currentTime, end: currentTime + 1 });
          } else {
            lastEntry.end = currentTime + 1;
          }
          currentJob.remainingTime -= 1;
          timeQuantumLeft -= 1;
          
          if (currentJob.remainingTime <= 0) {
            currentJob.state = 'finished';
            currentJob.completionTime = currentTime + 1;
            currentJob.turnaroundTime = currentJob.completionTime - currentJob.arrival;
            finishedJobsCount++;
            currentJob = null;
          } else if (algorithm === 'RR' && timeQuantumLeft <= 0) {
            currentJob.state = 'ready';
            readyQueue.push(currentJob);
            currentJob = null;
          }
        }
        
        jobs.filter(j => j.state === 'ready').forEach(j => j.waitingTime++);
        
        const queueForDisplay = Array.isArray(readyQueue) ? [...readyQueue] : readyQueue.heap.map(j => jobs.find(job => job.id === j.id) || j);
  
        if (finishedJobsCount === state.originalJobs.length && state.originalJobs.length > 0) {
          const totalTurnaround = jobs.reduce((acc, j) => acc + j.turnaroundTime, 0);
          const totalWaiting = jobs.reduce((acc, j) => acc + j.waitingTime, 0);
          const metrics = {
              avgTurnaroundTime: (totalTurnaround / jobs.length).toFixed(2),
              avgWaitingTime: (totalWaiting / jobs.length).toFixed(2),
              totalExecutionTime: currentTime + 1,
          };
          return { ...state, jobs, timeline, finishedJobsCount, isSimulating: false, metrics };
        }
  
        return { ...state, jobs, timeline, finishedJobsCount, currentTime: currentTime + 1, readyQueue: queueForDisplay, timeQuantumLeft };
      }
  
      case 'END_SIMULATION': return { ...state, isSimulating: false, isPaused: false, metrics: action.payload.metrics };
      case 'RESET': return { ...initialState, originalJobs: state.originalJobs, algorithm: state.algorithm, timeQuantum: state.timeQuantum };
      default: throw new Error(`Unhandled action type: ${action.type}`);
    }
  }

// --- THE HOOK ---
export const useJobScheduler = () => {
  const [state, dispatch] = useReducer(schedulerReducer, initialState);
  const intervalRef = useRef(null);
  const jobIdCounter = useRef(0);

  useEffect(() => {
    if (state.isSimulating && !state.isPaused) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 500 - state.simulationSpeed);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [state.isSimulating, state.isPaused, state.simulationSpeed]);

  const runSimulation = (algorithm, timeQuantum) => {
    const jobs = state.originalJobs;
    if (jobs.length === 0) {
        toast.error("Please add at least one job.");
        return;
    }
    const inDegree = new Map(jobs.map(j => [j.id, 0]));
    const adjList = new Map(jobs.map(j => [j.id, []]));
    jobs.forEach(j => j.dependencies.forEach(depId => {
        adjList.get(depId).push(j.id);
        inDegree.set(j.id, (inDegree.get(j.id) || 0) + 1);
    }));
    const queue = jobs.filter(j => inDegree.get(j.id) === 0);
    let sortedCount = 0;
    while(queue.length > 0) {
        const u = queue.shift();
        sortedCount++;
        adjList.get(u.id)?.forEach(vId => {
            inDegree.set(vId, inDegree.get(vId) - 1);
            if(inDegree.get(vId) === 0) queue.push(jobs.find(j => j.id === vId));
        });
    }
    if (sortedCount !== jobs.length) {
        toast.error("Cycle detected in job dependencies! Cannot run simulation.");
        return;
    }
    toast.success("Dependencies are valid. Starting simulation...");
    dispatch({ type: 'SETUP_SIMULATION', payload: { algorithm, timeQuantum } });
  };
  
  const pauseSimulation = () => dispatch({ type: 'PAUSE_SIMULATION' });
  const resumeSimulation = () => dispatch({ type: 'RESUME_SIMULATION' });
  const setSpeed = (speed) => dispatch({ type: 'SET_SPEED', payload: speed });
  const addJob = (job) => {
    const newId = jobIdCounter.current++;
    const newJobPayload = {
      ...job,
      id: newId,
      name: `Job ${newId + 1}`
    };
    dispatch({ type: 'ADD_JOB', payload: newJobPayload });
  };
  const resetSimulation = () => dispatch({ type: 'RESET' });

  return { state, addJob, resetSimulation, runSimulation, pauseSimulation, resumeSimulation, setSpeed };
};