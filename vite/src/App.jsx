import React, { useState, useEffect } from 'react';
import './App.css';


const authEndpoint = 'http://localhost:3000/auth'; // Authentication endpoint
const booksEndpoint = 'http://localhost:3000/books'; // Books endpoint

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', description: '', genre: '', author: '', isbn: '', status: '', category: '' });
  const [editBook, setEditBook] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track user authentication
  const [token, setToken] = useState('');
  const [loginData, setLoginData] = useState({ username: '', password: '' });

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

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${authEndpoint}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      setToken(data.token); // Store the token
      setIsAuthenticated(true); // Update authentication state
      localStorage.setItem('token', data.token); // Save token in localStorage
      alert('Login successful!');
      fetchBooks(); // Fetch books after successful login
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
    setBooks([]);
    localStorage.removeItem('token');
    alert('Logged out successfully');
  };

  // Handle book creation
  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User is not authenticated. Please log in again.');
      return;
    }
  
    console.log('Adding book:', newBook); // Log the book data being submitted
  
    try {
      const response = await fetch(booksEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add the token here
        },
        body: JSON.stringify(newBook),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create book');
      }
  
      const data = await response.json();
      console.log('Book created successfully:', data);
  
      setNewBook({ title: '', description: '', genre: '', author: '', isbn: '', status: '', category: '' }); // Reset form
      fetchBooks(); // Refresh book list after successful creation
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };
  

  // Fetch books when the app loads and user is authenticated
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchBooks();
  }, [isAuthenticated]);

  return (
    <div className="App">
      <h1>Library Management</h1>

      {/* Login Form */}
      {!isAuthenticated && (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {/* Logout Button */}
      {isAuthenticated && <button onClick={handleLogout}>Logout</button>}

      {/* Book Management Features */}
      {isAuthenticated && (
        <div>
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
      )}
    </div>
  );
}

export default App;
