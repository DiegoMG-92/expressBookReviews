const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Check if user already exists
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res
      .status(409)
      .json({
        message: "Username already exists. Please choose a different one.",
      });
  }

  // Add new user
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully." });
  //return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get('/isbn-data/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/isbn-async/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn-data/${isbn}`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).json({
        message: "Failed to fetch book by ISBN",
        error: error.message
      });
    });
});

// Get book details based on author
public_users.get('/author-data/:author', (req, res) => {
  const authorParam = req.params.author.toLowerCase();
  const matchingBooks = [];

  for (const isbn in books) {
    const book = books[isbn];
    if (book.author.toLowerCase() === authorParam) {
      matchingBooks.push({ isbn, ...book });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found by that author" });
  }
});

public_users.get('/author-async/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/author-data/${author}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch books by author",
      error: error.message
    });
  }
});

// Get all books based on title
public_users.get('/title-data/:title', (req, res) => {
  const titleParam = req.params.title.toLowerCase();
  const matchingBooks = [];

  for (const isbn in books) {
    const book = books[isbn];
    if (book.title.toLowerCase() === titleParam) {
      matchingBooks.push({ isbn, ...book });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with that title" });
  }
});

public_users.get('/title-async/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/title-data/${title}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch books by title",
      error: error.message
    });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
  //return res.status(300).json({ message: "Yet to be implemented" });
});

public_users.get('/books-data', (req, res) => {
  res.status(200).json(books);
});

// Get the book list available in the shop
public_users.get('/books-async', (req, res) => {
  axios.get('http://localhost:5000/books-data')
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).json({
        message: "Failed to fetch books",
        error: error.message
      });
    });
});

module.exports.general = public_users;
