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

describe('POST /api/articles/:article_id/comments', () => {
    it('should post a comment for a given article', async () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'This is a new comment!'
        };

        const res = await request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(201);

        expect(res.body.comment).toEqual(
            expect.objectContaining({
                comment_id: expect.any(Number),
                votes: 0, // Default value
                created_at: expect.any(String),
                author: 'butter_bridge',
                body: 'This is a new comment!',
                article_id: 1
            })
        );
    });

    it('should return a 400 error if the username or body is missing', async () => {
        const incompleteComment = { username: 'butter_bridge' };

        const res = await request(app)
            .post('/api/articles/1/comments')
            .send(incompleteComment)
            .expect(400);

        expect(res.body).toEqual({ msg: 'invalid input provide both username and body' });
    });

    it('should return a 400 error if the article_id is invalid', async () => {
        const newComment = { username: 'butter_bridge', body: 'This is a new comment!' };

        const res = await request(app)
            .post('/api/articles/not-a-number/comments')
            .send(newComment)
            .expect(400);

        expect(res.body).toEqual({ msg: 'Invalid article ID' });
    });

    it('should return a 404 error if the username does not exist', async () => {
        const newComment = { username: 'nonexistent_user', body: 'This is a new comment!' };

        const res = await request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(404);

        expect(res.body).toEqual({ msg: 'User not found' });
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    it('should return an array of comments for the given article_id', async () => {
        const res = await request(app)
            .get('/api/articles/1/comments')
            .expect(200);

        expect(Array.isArray(res.body.comments)).toBe(true);

        res.body.comments.forEach(comment => {
            expect(comment).toEqual(
                expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 1 // article_id should match the requested one
                })
            );
        });
    });

    it('should return comments sorted by most recent first', async () => {
        const res = await request(app)
            .get('/api/articles/1/comments')
            .expect(200);

        const comments = res.body.comments;

        expect(comments).toBeSortedBy('created_at', { descending: true });
    });

    it('should return a 400 error if article_id is invalid', async () => {
        const res = await request(app)
            .get('/api/articles/not-a-number/comments')
            .expect(400);

        expect(res.body).toEqual({ msg: 'Invalid article ID format' });
    });

    it('should return a 404 error if the article_id does not exist', async () => {
        const res = await request(app)
            .get('/api/articles/9999/comments') // Assuming 9999 is a non-existent article_id
            .expect(404);

        expect(res.body).toEqual({ msg: 'No comments found for this article.' });
    });

    it('should return an empty array if the article exists but has no comments', async () => {
        const res = await request(app)
            .get('/api/articles/3/comments')
            .expect(200);

        expect(Array.isArray(res.body.comments)).toBe(true);
        expect(res.body.comments.length).toBe(0);
    });
});

describe('PATCH /api/articles/:article_id', () => {
    it('should update the article votes', async () => {
        const res = await request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 1 });

        expect(res.statusCode).toBe(200);
        expect(res.body.article.votes).toBe(/* expected updated votes */);
    });

    it('should return 404 for an invalid article_id', async () => {
        const res = await request(app)
            .patch('/api/articles/999') // Assuming this ID does not exist
            .send({ inc_votes: 1 });

        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe('Article not found');
    });

    it('should return 400 if inc_votes is not a number', async () => {
        const res = await request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 'not_a_number' });

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('inc_votes must be number');
    });

    it('should return 400 if inc_votes is missing', async () => {
        const res = await request(app)
            .patch('/api/articles/1')
            .send({}); // No inc_votes

        expect(res.statusCode).toBe(400);
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    test('should delete the comment and respond with 204 status', async () => {
        const res = await request(app).delete('/api/comments/1').expect(204);
        expect(res.body).toEqual({});
    });

    test('should return a 404 error if the comment does not exist', async () => {
        const res = await request(app).delete('/api/comments/9999').expect(404);
        expect(res.body.msg).toBe('Comment not found');
    });

    test('should return a 400 error if the comment_id is invalid', async () => {
        const res = await request(app).delete('/api/comments/invalid-id').expect(400);
        expect(res.body.msg).toBe('Invalid comment ID');
    });
});