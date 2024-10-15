const request = require('supertest');
const app = require('../db/app');
const db = require('../db/connection');

beforeEach(async () => {
    await db.query('DELETE FROM comments');
    await db.query('DELETE FROM articles');
    await db.query(`INSERT INTO articles (author, title, body, topic, created_at, votes, article_img_url)
        VALUES ('jessjelly', 'Running a Node App', 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.', 'coding', '2020-11-07T06:03:00.000Z', 0, 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700')`);

    // Add a log or fetch the data to check if it's inserted
    // const result = await db.query('SELECT * FROM articles;');
    // console.log(result.rows); // Log the result to check if the row exists
});

afterAll(async () => {
    await db.end();
});

describe('GET /api/articles/:article_id', () => {
    // it('should return an article by its ID', async () => {
    //     const res = await request(app).get('/api/articles/1');
    //     //expect(res.statusCode).toBe(200);
    //     console.log(res, "res")
    //     expect(res.body).toEqual({
    //         author: 'jessjelly',
    //         title: 'Running a Node App',
    //         article_id: 1,
    //         body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
    //         topic: 'coding',
    //         created_at: expect.any(String),
    //         votes: 0,
    //         article_img_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700'
    //     });
    // });

    it('should return a 404 error for a non-existent article ID', async () => {
        const res = await request(app).get('/api/articles/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ msg: 'Article not found' });
    });

    it('should return a 400 error for an invalid article ID format', async () => {
        const res = await request(app).get('/api/articles/invalid-id');
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ msg: 'Invalid article ID format' });
    });
});
