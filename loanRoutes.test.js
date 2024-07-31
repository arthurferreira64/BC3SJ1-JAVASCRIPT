const request = require('supertest');
const express = require('express');
const router = require('./router/loans');
const app = express();

app.use(express.json());
app.use('/api', router);

describe('POST /loan', () => {
    it('should create a new loan and update book status', async () => {
        const loanData = {book_id: 1, user_id: 1};

        const response = await request(app)
            .post('/api/loan')
            .send(loanData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Loan created successfully');
        expect(response.body).toHaveProperty('loan_id');
    });
});

describe('POST /return', () => {
    it('should return a book and update book status', async () => {
        const returnData = {loan_id: 1};

        const response = await request(app)
            .post('/api/return')
            .send(returnData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Book returned successfully');
    });
});

describe('GET /history/:id', () => {
    it('should fetch loan history for a user', async () => {
        const userId = 1;

        const response = await request(app)
            .get(`/api/history/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

});
