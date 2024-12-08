import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import RegistrationPage from './page/registrationPage';
import LoginPage from './page/loginPage';
import BooksPage from './page/booksPage';
import './App.css';
const booksEndpoint = 'http://localhost:3000/books';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch books
  const fetchBooks = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(booksEndpoint, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '', 
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch books. Status:', response.status);
        throw new Error('Failed to fetch books');
      }

      const booksData = await response.json();
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]); 
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <header>
        <h1>The Book Store</h1>
        <img src="TheCodersLogo.png" alt="Team Logo" class="logo" />
        <nav id="navbar">
          <a href="/">Home</a>
          <a href="/register">Sign Up</a>
          <a href="/login">Sign In</a>
        </nav>
      </header>
      <main>
      <h1>Book List:</h1>
        <div id="book-list">
          {books.length === 0 ? (
            <p>No books available.</p>
          ) : (
            books.map((book, index) => (
              <div key={index} className="book-item">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>Status:</strong> {book.status}</p>
                <p><strong>Category:</strong> {book.category}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    alert('Logged out successfully');
    navigate('/login')
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/books"
          element={<BooksPage token={token} isAuthenticated={isAuthenticated} handleLogout={handleLogout} />}
        />
      </Routes>
    </div>
  );
}

export default App;

