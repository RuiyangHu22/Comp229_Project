const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const authenticateToken = require('../middleware/authenticateToken'); // Make sure to include the authentication middleware


router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new book (ensure this route is protected)
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, genre, author, isbn, status, category } = req.body;

  // Validation to check if essential fields are provided
  if (!title || !description || !author || !isbn) {
    return res.status(400).json({ message: 'Title, description, author, and ISBN are required' });
  }

  try {
    // Create a new book document
    const newBook = new Book({
      title,
      description,
      genre,
      author,
      isbn,
      status,
      category,
    });

    // Save the new book in the database
    await newBook.save();
    res.status(201).json(newBook); // Respond with the created book
  } catch (err) {
    res.status(500).json({ message: 'Error creating book', error: err.message });
  }
});

module.exports = router;
