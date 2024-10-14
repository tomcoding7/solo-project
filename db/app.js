const express = require('express')
const topicsRouter = require('../routes/topics')

const app = express()
app.use(express.json())
app.use(topicsRouter)

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})

module.exports = app