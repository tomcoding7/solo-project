// In articlesController.js
const articlesModel = require('../models/articlesmodel'); // Adjust the path as necessary

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

module.exports = { getArticleById };
