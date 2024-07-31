
const express = require('express');
const router = express.Router();
const db = require('../services/database');

// Create a new loan
router.post('/loan', (req, res) => {
    const { book_id, user_id } = req.body;
    const loan_date = new Date();
    const return_date = new Date();
    return_date.setDate(loan_date.getDate() + 30); // 30 days loan period

    const loanQuery = 'INSERT INTO loans (book_id, user_id, loan_date, return_date) VALUES (?, ?, ?, ?)';
    const updateBookStatusQuery = 'UPDATE livres SET statut = "emprunté" WHERE id = ?';

    db.query(loanQuery, [book_id, user_id, loan_date, return_date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(updateBookStatusQuery, [book_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Loan created successfully', loan_id: result.insertId });
        });
    });
});

// Return a book
router.post('/return', (req, res) => {
    const { loan_id } = req.body;
    const returnLoanQuery = 'UPDATE loans SET returned = TRUE WHERE id = ?';
    const getBookIdQuery = 'SELECT book_id FROM loans WHERE id = ?';
    const updateBookStatusQuery = 'UPDATE livres SET statut = "disponible" WHERE id = ?';

    db.query(returnLoanQuery, [loan_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(getBookIdQuery, [loan_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            const book_id = results[0].book_id;
            db.query(updateBookStatusQuery, [book_id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).json({ message: 'Book returned successfully' });
            });
        });
    });
});

// Get loan status
router.get('/status/:user_id', (req, res) => {
    const { user_id } = req.params;
    const query = 'SELECT * FROM loans WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Get loan history
router.get('/history/:id', (req, res) => {
    const user_id = req.params.id; // Correctly extract user_id from request parameters
    const query = 'SELECT * FROM loans WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Get loans by user ID with joins
router.get('/user/:id', (req, res) => {
    const user_id  = req.params.id;
    const query = `
        SELECT loans.*, livres.titre AS book_title, utilisateurs.email AS user_email
        FROM loans
        JOIN livres ON loans.book_id = livres.id
        JOIN utilisateurs ON loans.user_id = utilisateurs.id
        WHERE loans.user_id = ? AND loans.returned = FALSE
    `;
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Get all loans with joins
router.get('/loans', (req, res) => {
    const query = `
        SELECT loans.*, livres.titre AS book_title, utilisateurs.email AS user_email
        FROM loans
        JOIN livres ON loans.book_id = livres.id
        JOIN utilisateurs ON loans.user_id = utilisateurs.id
        WHERE loans.returned = FALSE
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});



module.exports = router;
