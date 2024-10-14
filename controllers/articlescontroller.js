const db = require('../db/connection')

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).send({ msg: 'Article not found' })
            }
            res.status(200).send({ article: result.rows[0] })
        })
        .catch(err => {
            next(err)
        })
}

module.exports = { getArticleById }