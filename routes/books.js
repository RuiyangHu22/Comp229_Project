const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const authenticateToken = require('../middleware/authenticateToken');


router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//update book by id
router.put('/:id', getBook, async (req, res) => {
  if (req.body.title != null) {
    res.book.title = req.body.title
  }
  if (req.body.description != null) {
    res.book.description = req.body.description
  }
  if (req.body.genre != null) {
    res.book.genre = req.body.genre
  }
  if (req.body.author != null) {
    res.book.author = req.body.author
  }
  if (req.body.isbn != null) {
    res.book.isbn = req.body.isbn
  }
  if (req.body.status != null) {
    res.book.status = req.body.status
  }
  if (req.body.category != null) {
    res.book.category = req.body.category
  }
  try {
    const updatedBook = await res.book.save()
    res.json(updatedBook)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Delete by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'Failed to delete book', error: err.message });
  }
});


// Create a new book (ensure this route is protected)
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, genre, author, isbn, status, category } = req.body;

  console.log('Request Body:', req.body);

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

async function getBook(req, res, next) {
  let book
  try {
    book = await Book.findById(req.params.id)
    if (book == null) {
      return res.status(404).json({ message: 'Cannot find book' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.book = book
  next()
}

module.exports = router;