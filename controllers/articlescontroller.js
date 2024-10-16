// In articlesController.js
const articlesModel = require('../models/articlesmodel'); // Adjust the path as necessary
const db = require('../db/connection')

const deleteCommentById = async (req, res, next) => {
    const { comment_id } = req.params;
    if (isNaN(comment_id)) {
        return res.status(400).send({ msg: 'Invalid comment ID' });
    }

    try {
        const result = await db.query(
            'DELETE FROM comments WHERE comment_id = $1 RETURNING *;',
            [comment_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({ msg: 'Comment not found' });
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

const updateArticle = async (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (typeof inc_votes !== 'number') {
        return res.status(400).send({ msg: 'inc_votes must be number' })
    }
    try {
        const result = await db.query(
            `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
            [inc_votes, article_id]
        )

        if (result.rows.length === 0) {
            return res.status(404).send({ msg: 'Article not found' })
        }
        res.status(200).send({ article: result.rows[0] })
    } catch (err) {
        next(err)
    }

}

const getCommentsByArticleId = async (req, res, next) => {
    const { article_id } = req.params;

    if (isNaN(article_id)) {
        return res.status(400).send({ msg: 'Invalid article ID format' });
    }

    try {

        const result = await db.query(`
            SELECT comment_id, votes, created_at, author, body, article_id 
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC;
        `, [article_id]);

        const comments = result.rows;

        if (comments.length === 0) {
            return res.status(404).send({ msg: 'No comments found for this article.' });
        }

        res.status(200).send({ comments });
    } catch (err) {
        next(err);
    }
};

const postComments = async (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    if (isNaN(article_id)) {
        return res.status(400).send({ msg: 'Invalid article ID' })
    }
    if (!username || typeof username !== 'string' || !body || typeof body !== 'string') {
        return res.status(400).send({ msg: 'invalid input provide both username and body' })
    }
    try {
        const result = await db.query(`
            INSERT INTO comments (author, body, article_id)
            VALUES ($1, $2, $3)
            RETURNING comment_id, votes, created_at, author, body, article_id;`,
            [username, body, article_id]
        );
        const newComment = result.rows[0]
        res.status(201).send({ comment: newComment })
    } catch (err) {
        next(err)
    }
}


const getArticles = async (req, res, next) => {
    try {
        const result = await db.query(`SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
    `);

        const articles = result.rows;

        res.status(200).send({ articles })
    } catch (err) {
        next(err)
    }
}

const getArticleById = async (req, res, next) => {
    const { article_id } = req.params;

    // Validate article_id format
    if (isNaN(article_id)) {
        return res.status(400).send({ msg: 'Invalid article ID format' });
    }

    try {
        const article = await articlesModel.getArticleById(article_id);

        if (!article) {
            return res.status(404).send({ msg: 'Article not found' });
        }

        res.status(200).send({ article });
    } catch (err) {
        console.error(err);
        next(err); // Pass the error to the error handling middleware
    }
};

module.exports = { getArticleById, getArticles, postComments, getCommentsByArticleId, updateArticle, deleteCommentById };
