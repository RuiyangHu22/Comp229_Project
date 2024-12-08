import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './page/registrationPage';
import LoginPage from './page/loginPage';
import BooksPage from './page/booksPage';
import './App.css';

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
  



  // Update book
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${booksEndpoint}/${editBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Correct Bearer format
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
      const response = await fetch(`${booksEndpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },

      });
      fetchBooks();
    } catch (error) {
      console.error('Failed to delete book:', error);
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
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
         <Route
            path="/books"
            element={<BooksPage token={token} isAuthenticated={isAuthenticated} handleLogout={handleLogout} />}
          />
        
      </Routes>
    </Router>
      
    </div>

    
  );
}

 

export default App;
