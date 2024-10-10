// src/controllers/dispatchController.js
const DispatchJob = require('../models/DispatchJob');

// Create a new Dispatch Job
exports.createJob = async (req, res) => {
    try {
        const { jobId, location, scheduledTime, driver, truckId } = req.body;
        const scheduledBy = req.user.id;
        const newJob = new DispatchJob({ jobId, location, scheduledTime, driver, truckId, scheduledBy});
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Dispatch Jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await DispatchJob.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//get a list of jobs for a specific driver
exports.getJobs = async (req, res) => {
    try {
        const jobs = await DispatchJob.find({ driver: req.user.id });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Dispatch Job
exports.getJobById = async (req, res) => {
    try {
        const job = await DispatchJob.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Dispatch Job Status
exports.updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const job = await DispatchJob.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        job.status = status;
        const updatedJob = await job.save();
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Dispatch Job
exports.deleteJob = async (req, res) => {
    try {
        const job = await DispatchJob.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        await job.remove();
        res.status(200).json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
