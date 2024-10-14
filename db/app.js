const express = require('express');
const topicsRouter = require('../routes/topics');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(topicsRouter);

app.use((err, req, res, next) => {
    console.error('Error:', err.message); // Log the error
    res.status(500).send({ message: err.message });
});

module.exports = app;
