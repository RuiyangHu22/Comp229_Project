import React, { useState, useEffect } from 'react';
import './App.css'

const database = 'http://localhost:3000/books';

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '',  description: '',  genre: '',author: '', isbn: '',  status: '', category: '' });
  const [editBook, setEditBook] = useState(null);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await fetch(database);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Create a new book
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(database, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });
      if (!response.ok) throw new Error('Failed to create book');
      fetchBooks();
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  // Edit an existing book
  const handleEdit = (book) => {
    setEditBook(book);
  };

  // Update book
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${database}/${editBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editBook),
      });
      fetchBooks();
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  // Delete a book
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${database}/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="App">
      <h1>Library Management</h1>

      <h2>Create Book</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newBook.description}
          onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={newBook.isbn}
          onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
        />
        <input
          type="text"
          placeholder="status"
          value={newBook.status}
          onChange={(e) => setNewBook({ ...newBook, status: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newBook.category}
          onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
        />
        <button type="submit">Add Book</button>
      </form>

      {editBook && (
        <div>
          <h2>Edit Book</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={editBook.title}
              onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
            />
            <input
              type="text"
              value={editBook.description}
              onChange={(e) => setEditBook({ ...editBook, description: e.target.value })}
            />
            <input
              type="text"
              value={editBook.genre}
              onChange={(e) => setEditBook({ ...editBook, genre: e.target.value })}
            />
            <input
              type="text"
              value={editBook.author}
              onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
            />
            <input
              type="text"
              value={editBook.isbn}
              onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
            />
            <input
              type="text"
              value={editBook.status}
              onChange={(e) => setEditBook({ ...editBook, status: e.target.value })}
            />
            <input
              type="text"
              value={editBook.category}
              onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
            />
            <button type="submit">Update Book</button>
            <button type="button" onClick={() => setEditBook(null)}>Cancel</button>
          </form>
        </div>
      )}

      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <h3>{book.title}</h3>
            <p>Description: {book.description}</p>
            <p>Genre: {book.genre}</p>
            <p>Author: {book.author}</p>
            <p>ISBN: ${book.isbn}</p>
            <p>Status: {book.status}</p>
            <p>Category: {book.category}</p>
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;