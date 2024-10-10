// src/models/DispatchJob.js
const mongoose = require('mongoose');

const DispatchJobSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        unique: true
    },
    scheduledBy: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    driver: {
        type: String,
        required: false,
        default: null
    },
    truckId: {
        type: String,
        required: false,
        default: null
    },
    status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed'],
        default: 'Scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DispatchJob', DispatchJobSchema);
