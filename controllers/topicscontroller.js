const db = require('../db/connection')

const getTopics = async (req, res) => {
    //console.log(res, "res")
    try {
        const topics = await db.query('SELECT * FROM topics'); // Ensure no schema is added if it's in public
        console.log(topics, "topics")
        res.status(200).json(topics.rows);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getTopics }