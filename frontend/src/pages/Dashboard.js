// src/pages/Dashboard.js
import React, { useContext, useEffect, useState } from 'react';
import api from '../services/api'; // Use the custom Axios instance
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateJob from '../components/CreateJob';
import { toast } from 'react-toastify'; // For notifications

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dispatchJobs, setDispatchJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dispatch jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/dispatch');
        setDispatchJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dispatch jobs:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch dispatch jobs');
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle delete job
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/dispatch/${id}`);
        setDispatchJobs(prevJobs => prevJobs.filter(job => job._id !== id));
        toast.success('Dispatch job deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error(error.response?.data?.message || 'Failed to delete dispatch job');
      }
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await api.patch(`/dispatch/${id}/status`, { status: newStatus });
      setDispatchJobs(prevJobs => prevJobs.map(job => job._id === id ? response.data : job));
      toast.success(`Job status updated to "${newStatus}"!`);
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error(error.response?.data?.message || 'Failed to update job status');
    }
  };

  // Handle new job creation
  const handleJobCreated = (newJob) => {
    setDispatchJobs(prevJobs => [...prevJobs, newJob]);
    toast.success('New dispatch job created successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <CreateJob onJobCreated={handleJobCreated} />

      {loading ? (
        <div className="flex justify-center items-center">
          <svg 
            className="animate-spin h-8 w-8 text-blue-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4">
            </circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8v8H4z">
            </path>
          </svg>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Job ID</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Scheduled Time</th>
                <th className="py-2 px-4 border-b">Driver</th>
                <th className="py-2 px-4 border-b">Truck ID</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dispatchJobs.map(job => (
                <tr key={job._id}>
                  <td className="py-2 px-4 border-b">{job.jobId}</td>
                  <td className="py-2 px-4 border-b">{job.location}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(job.scheduledTime).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">{job.driver}</td>
                  <td className="py-2 px-4 border-b">{job.truckId}</td>
                  <td className="py-2 px-4 border-b">{job.status}</td>
                  <td className="py-2 px-4 border-b">
                    <button 
                      onClick={() => handleStatusUpdate(job._id, 'In Progress')} 
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      disabled={job.status !== 'Scheduled'}
                    >
                      In Progress
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(job._id, 'Completed')} 
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                      disabled={job.status !== 'In Progress'}
                    >
                      Completed
                    </button>
                    <button 
                      onClick={() => handleDelete(job._id)} 
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {dispatchJobs.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="text-center py-4">No dispatch jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
