const request = require('supertest');
const app = require('../db/app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed')
const testdata = require('../db/data/test-data')

beforeEach(async () => {
    await seed(testdata)
});

afterAll(async () => {
    await db.end();
});

describe('GET /api/articles/:article_id', () => {
    it('should return an article by its ID', async () => {
        const res = await request(app).get('/api/articles/1');
        expect(res.statusCode).toBe(200);
        // console.log(res.body.article, "res")
        expect(res.body.article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
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

describe('GET /api/articles', () => {
    test('should return a list of articles without the body field', async () => {
        const res = await request(app).get('/api/articles');
        expect(Array.isArray(res.body.articles)).toBe(true);
        res.body.articles.forEach(article => {
            expect(article).toEqual(
                expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String), // Change this to expect.any(String)
                })
            );
            expect(article.body).toBeUndefined();
        });
    });

});
