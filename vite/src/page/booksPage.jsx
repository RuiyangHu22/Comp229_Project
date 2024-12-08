import React, { useState, useEffect } from 'react';

const BooksPage = ({ token, isAuthenticated, handleLogout }) => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', description: '', genre: '', author: '', isbn: '', status: '', category: '' });
  const [editBook, setEditBook] = useState(null);

  const booksEndpoint = 'http://localhost:10000/books';



  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await fetch(booksEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
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


  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found. Please log in.');
    alert('No token found. Please log in.');
    return;
  }
    try {
      const response = await fetch(booksEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
      });
      if (!response.ok){

      const errorData = await response.json();
      console.error('Error Response:', errorData);
      throw new Error('Failed to create book');
      }
      await fetchBooks();
      setNewBook({ title: '', description: '', genre: '', author: '', isbn: '', status: '', category: '' });
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  
  // Edit an existing book
  const handleEdit = (book) => {
    setEditBook(book);
  };



  // Update an existing book
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${booksEndpoint}/${editBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editBook),
      });
      if (!response.ok) throw new Error('Failed to update book');
      await fetchBooks();
      setEditBook(null);
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  // Delete a book
  const handleDelete = async (id) => {
    try {
      await fetch(`${booksEndpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBooks();
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };


  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <header>
        <h1>The Book Store</h1>
        <nav id="navbar">
          <a href="/">Home</a>
          <a href="/books">My Books</a>
          <a href="" onClick={handleLogout}>
            Logout
          </a>
        </nav>
      </header>

      <h2>Add Book</h2>
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
          placeholder="Status"
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
            <button type="button" onClick={() => setEditBook(null)}>
              Cancel
            </button>
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
            <p>ISBN: {book.isbn}</p>
            <p>Status: {book.status}</p>
            <p>Category: {book.category}</p>
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BooksPage;