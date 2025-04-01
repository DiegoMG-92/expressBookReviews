const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if user already exists
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists. Please choose a different one." });
  }

  // Add new user
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully." });
  //return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
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
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
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
  //return res.status(300).json({ message: "Yet to be implemented" });
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

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  console.log("GET / hit");
  res.status(200).send(JSON.stringify(books, null, 4)); // neatly formatted
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
