// src/components/CreateJob.js
import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const schema = yup.object().shape({
  jobId: yup.string().required('Job ID is required'),
  location: yup.string().required('Location is required'),
  scheduledTime: yup.date().required('Scheduled Time is required'),
  driver: yup.string().required('Driver is required'),
  truckId: yup.string().required('Truck ID is required')
});

const CreateJob = ({ onJobCreated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/dispatch', data);
      alert('Dispatch job created successfully!');
      onJobCreated(response.data);
      reset();
    } catch (error) {
      console.error('Error creating dispatch job:', error.response.data);
      alert(error.response.data.message || 'Failed to create dispatch job');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md mb-6">
      <h3 className="text-xl mb-4">Create New Dispatch Job</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Job ID</label>
          <input 
            type="text" 
            {...register('jobId')} 
            className="md:w-1/4 px-3 py-2 border rounded"
          />
          {errors.jobId && <p className="text-red-500 text-sm mt-1">{errors.jobId.message}</p>}
        </div>
        
        <div>
          <label className="block mb-1">Location</label>
          <input 
            type="text" 
            {...register('location')} 
            className="w-full px-3 py-2 border rounded"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>
        
        <div>
          <label className="block mb-1">Scheduled Time</label>
          <input 
            type="datetime-local" 
            {...register('scheduledTime')} 
            className="w-full px-3 py-2 border rounded"
          />
          {errors.scheduledTime && <p className="text-red-500 text-sm mt-1">{errors.scheduledTime.message}</p>}
        </div>
        
        <div>
          <label className="block mb-1">Driver</label>
          <input 
            type="text" 
            {...register('driver')} 
            className="w-full px-3 py-2 border rounded"
          />
          {errors.driver && <p className="text-red-500 text-sm mt-1">{errors.driver.message}</p>}
        </div>
        
        <div>
          <label className="block mb-1">Truck ID</label>
          <input 
            type="text" 
            {...register('truckId')} 
            className="w-full px-3 py-2 border rounded"
          />
          {errors.truckId && <p className="text-red-500 text-sm mt-1">{errors.truckId.message}</p>}
        </div>
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Job
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
