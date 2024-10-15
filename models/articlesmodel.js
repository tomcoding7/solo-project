const db = require('../db/connection'); // Adjust the path as necessary

const getArticleById = async (article_id) => {
    const result = await db.query('SELECT * FROM articles WHERE article_id = $1', [article_id]);
    return result.rows[0]; // Return the article or undefined if not found
};

const deleteAllArticles = async () => {
    await db.query('DELETE FROM articles');
};

const insertArticle = async (article) => {
    const { author, title, body, topic, created_at, votes, article_img_url } = article;
    await db.query(`
        INSERT INTO articles (author, title, body, topic, created_at, votes, article_img_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, [author, title, body, topic, created_at, votes, article_img_url]);
};

module.exports = { getArticleById, deleteAllArticles, insertArticle };