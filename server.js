require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const booksRouter = require('./routes/books');
const authenticateToken = require('./middleware/authenticateToken');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to Database'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.use('/auth', authRouter);
app.use('/books',  booksRouter);

// Base Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start Server
app.listen(port, () => console.log(`Server started on port ${port}`));
