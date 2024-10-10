// src/routes/dispatchRoutes.js
const express = require('express');
const router = express.Router();
const dispatchController = require('../controllers/dispatchController');
const { protect, admin } = require('../middleware/authMiddleware');

//create a job
router.post('/', protect, admin, dispatchController.createJob);

// Get all jobs
router.get('/', protect, admin, dispatchController.getAllJobs);

//get a list of jobs for a specific driver
router.get('/driver', protect, dispatchController.getJobs);

// Get a single job by ID
router.get('/:id', protect, dispatchController.getJobById);

// Update job status
router.patch('/:id/status', protect, dispatchController.updateJobStatus);

// Delete a job
router.delete('/:id', protect, admin, dispatchController.deleteJob);

module.exports = router;
