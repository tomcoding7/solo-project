const express = require('express');
const fs = require('fs')
const path = require('path');
const { getArticleById, getArticles, postComments, getCommentsByArticleId, updateArticle } = require('../controllers/articlescontroller')

const { getTopics } = require('../controllers/topicscontroller')

const endpoints = require('../endpoints.json')

const router = express.Router();

router.get('/api/articles', getArticles);

router.get('/api/articles/:article_id/comments', getCommentsByArticleId)

router.post('/api/articles/:article_id/comments', postComments);

router.patch('/api/articles/:article_id', updateArticle)

router.get('/api/articles/:article_id', getArticleById);

router.get('/api', (req, res) => {
    res.status(200).json(endpoints)
})

router.get('/api/topics', getTopics);

module.exports = router;