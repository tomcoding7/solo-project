const express = require('express');
const topicsRouter = require('../routes/topics');
const { Pool } = require('pg');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(topicsRouter);

app.use((err, req, res, next) => {
    console.error('Error:', err.message); // Log the error
    res.status(500).send({ message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = app;
