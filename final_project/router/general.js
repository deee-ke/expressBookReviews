const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let disBooks = new Object;
  Object.assign(disBooks,{
    books
  })
  res.send(JSON.stringify(disBooks,null,4))
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here  
    const author = req.params.author;
    let booksbyauthor = []; 
  for (let isbn in books){
    if(books[isbn].author === author){
      let book = books[isbn];
      booksbyauthor.push({
        isbn,
        title:book.title,
        reviews:book.reviews
      });
    }
  }
  let matchBooks = new Object;
  Object.assign(matchBooks, {
    booksbyauthor
  });
  res.send(matchBooks);
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksbytitle = [];
  for(let isbn in books){
    if(books[isbn].title === title){
      let book = books[isbn];
      booksbytitle.push({
        isbn,
        author:book.author,
        reviews:book.reviews
      });
    }
  }
  let matchTitle = new Object;
  Object.assign(matchTitle,{
    booksbytitle
  });
  res.send(matchTitle);
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
