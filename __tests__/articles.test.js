const request = require('supertest')
const app = require('../db/app')
const db = require('../db/connection')

beforeEach(async () => {
    await db.query('DELETE FROM articles')
    await db.query(`INSERT INTO articles (author, title, body, topic, created_at, votes, article_img_url)
        VALUES ('weegembump', 'Seafood substitutions are increasing', 'Text from the article..', 'cooking', '2018-05-30T15:59:13.341Z', 0, 'url_to_image.jpg')`);
})

afterAll(async () => {
    await db.end()
})

describe('GET /api/articles/:article_id', () => {
    it('should return an article by its ID', async () => {
        const res = await request(app).get('/api/articles/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.article).toEqual({
            author: 'weegembump',
            title: 'Seafood substitutions are increasing',
            article_id: 1,
            body: 'Text from the article..',
            topic: 'cooking',
            created_at: expect.any(String), // You can also check for the exact date if needed
            votes: 0,
            article_img_url: 'url_to_image.jpg',
        });
    });

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