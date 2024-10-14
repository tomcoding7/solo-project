const express = require('express');
const router = express.Router();
const { getTopics } = require('../controllers/topicscontroller')


router.get('/api/topics', getTopics);

module.exports = router;