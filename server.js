require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const booksRouter = require('./routes/books');
const authenticateToken = require('./middleware/authenticateToken');
const path = require('path');

const app = express();
const port = 'https://comp229-backend-1nco.onrender.com';


// Middleware
app.use(cors());


app.use(express.json());



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to Database'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));


    
// Routes
app.use('/auth', authRouter);
app.use('/books',  booksRouter);

app.use(express.static(path.join(__dirname, 'vite', 'dist')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'vite', 'dist', 'index.html'));
});


// Start Server
app.listen(port, () => console.log(`Server started on port ${port}`));
