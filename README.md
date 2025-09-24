# Scheduler Sandbox - CPU Algorithm Visualizer

## Features

* **Multiple Scheduling Algorithms:** Visualize a wide range of algorithms, including:
    * First-Come, First-Served (FCFS)
    * Shortest Remaining Time First (SRTF - Preemptive)
    * Longest Remaining Time First (LRTF - Preemptive)
    * Priority Scheduling (Preemptive)
    * Round Robin
* **Job Dependency Management:** Uniquely supports defining **dependencies** between jobs. The scheduler uses **Topological Sort** to ensure a valid execution order.
* **Interactive Real-Time Simulation:** Full control over the simulation with **play, pause, reset, and speed adjustment** controls.
* **Dynamic Visualizations:**
    * **Gantt Chart:** A clear, color-coded timeline of job execution.
    * **Live Ready Queue:** Watch jobs enter and leave the ready queue data structure as the simulation runs.
* **Detailed Performance Analysis:**
    * **Metrics Dashboard:** Automatically calculates and displays average waiting time, turnaround time, and total execution time.
    * **Process Details Table:** A complete breakdown of metrics for each individual job.
    * **Job Color Key:** A legend to easily identify jobs in the Gantt chart.
* **Customizable Job Configuration:** Add jobs with custom **arrival times, burst times, priorities, and dependencies**.

---

## Core Concepts & Tech Stack

This project was built to apply and demonstrate a deep understanding of computer science fundamentals within a modern web development context.

### Core Logic / DSA

* **Priority Queue:** Implemented from scratch using a **Min-Heap** data structure to efficiently manage jobs in priority-based algorithms (Priority, SRTF, LRTF).
* **Topological Sort:** Uses **Kahn's Algorithm** to validate the job dependency graph, detecting and preventing impossible circular dependencies before the simulation begins.
* **State Management:** Leverages the `useReducer` hook for robust and predictable management of the complex simulation state, including job statuses, the timeline, and real-time metrics.

### Frontend

* **Framework:** **React.js**
* **Build Tool:** **Vite**
* **Styling:** **CSS** (with CSS Variables for theming)
* **UI Components:** `react-select` for enhanced input fields.

---

## Getting Started

To run this project locally, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sayan-repo/Scheduler-Sandbox---Algorithm-Visualizer.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Scheduler-Sandbox---Algorithm-Visualizer
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
5.  Open your browser and go to `http://localhost:5173` to see the application running.

---

## How to Use

1.  **Add Jobs:** Use the "Configuration" panel to add jobs. Define their **Arrival Time**, **Burst Time**, **Priority**, and any **Dependencies** on other jobs.
2.  **Select an Algorithm:** Choose a scheduling algorithm from the dropdown menu. If you select "Round Robin," a field for "Time Quantum" will appear.
3.  **Run Simulation:** Click the "Run" button to start the simulation.
4.  **Control Execution:** Use the **play/pause** button and the **speed slider** to observe the scheduling process at your own pace.
5.  **Analyze Results:** Watch the **Gantt Chart** and **Ready Queue** update in real-time. After the simulation finishes, review the **Metrics Dashboard** and the detailed **Process Details Table** to compare algorithm performance.
