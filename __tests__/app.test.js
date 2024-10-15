const request = require('supertest');
const app = require('../db/app');

describe('GET /api/topics', () => {
    test('should respond with an array of topic objects', async () => {
        const response = await request(app).get('/api/topics');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        //console.log(response, "response test")
        response.body.forEach(topic => {
            expect(topic).toHaveProperty('slug');
            expect(topic).toHaveProperty('description');
        });
    });

    test('should handle errors gracefully', async () => {


        const response = await request(app).get('/api/topics');


        expect(response.statusCode).not.toBe(500);

    });
});

describe('GET /api', () => {
    it('should return API documentation', async () => {
        const response = await request(app).get('/api');

        // console.log(response, "response")
        expect(response.statusCode).toBe(200);
    });
});