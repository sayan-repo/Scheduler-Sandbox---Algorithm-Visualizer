import React, { useState } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';

const JobForm = ({ addJob, existingJobs }) => {
  const [burst, setBurst] = useState(10);
  const [priority, setPriority] = useState(1);
  const [dependencies, setDependencies] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (burst <= 0) {
      toast.error('Burst time must be positive.');
      return;
    }
    addJob({ 
        burst: parseInt(burst), 
        priority: parseInt(priority),
        dependencies: dependencies.map(dep => dep.value)
    });
    toast.success('Job added!');
    setDependencies([]); // Clear selection after adding
  };

  const jobOptions = existingJobs.map(job => ({ value: job.id, label: job.name }));

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <h3>Add a New Job</h3>
      <div className="form-group">
        <label>Burst Time (ms)</label>
        <input type="number" value={burst} onChange={(e) => setBurst(e.target.value)} min="1" />
      </div>
      <div className="form-group">
        <label>Priority (lower is higher)</label>
        <input type="number" value={priority} onChange={(e) => setPriority(e.target.value)} min="1" />
      </div>
      <div className="form-group">
        <label>Dependencies</label>
         <Select
            isMulti
            options={jobOptions}
            value={dependencies}
            onChange={setDependencies}
            placeholder="Select jobs this depends on..."
            styles={{
                control: (base) => ({...base, background: '#333', border: '1px solid #555'}),
                menu: (base) => ({...base, background: '#333'}),
                option: (base, state) => ({
                    ...base,
                    background: state.isFocused ? '#555' : '#333',
                    color: '#fff'
                }),
                multiValue: (base) => ({...base, background: '#555'}),
                multiValueLabel: (base) => ({...base, color: '#fff'}),
            }}
        />
      </div>
      <button type="submit">Add Job</button>
    </form>
  );
};

export default JobForm;