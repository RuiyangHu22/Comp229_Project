import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate  } from 'react-router-dom';
import RegistrationPage from './page/registrationPage';
import LoginPage from './page/loginPage';
import BooksPage from './page/booksPage';
import './App.css';

const booksEndpoint = 'http://localhost:3000/books'; // Books endpoint

function App() {
  const [books, setBooks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track user authentication
  const [token, setToken] = useState('');
  const navigate = useNavigate();

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
    alert('Logged out successfully');
    localStorage.removeItem('token');
    navigate('/login');
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
      <Routes>
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
