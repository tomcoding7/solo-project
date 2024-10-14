const express = require('express');
const fs = require('fs')
const path = require('path');
const { getArticleById } = require('../controllers/articlescontroller')
const endpoints = require('../endpoints.json')

const router = express.Router();
router.get('/:article_id', getArticleById);

router.get('/api', (req, res) => {
    res.status(200).json(endpoints)
    // const filePath = path.join(__dirname, '../endpoints.json');

    // fs.readFile(filePath, 'utf8', (err, data) => {
    //     if (err) {
    //         console.error('Error reading endpoints', err)
    //         return res.status(500).send('internal server')
    //     }

    //     try {
    //         const endpoints = JSON.parse(data);
    //         res.status(200).json(endpoints);
    //     } catch (parseError) {
    //         console.error('Error', parseError)
    //         res.status(500).send('Internal server error')
    //     }
    // })

})

const { getTopics } = require('../controllers/topicscontroller')


router.get('/api/topics', getTopics);

module.exports = router;