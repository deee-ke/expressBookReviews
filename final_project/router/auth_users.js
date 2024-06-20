const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = [];

const jwt_secret = "access";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validUsers.length>0){
    return true;
  } else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username,password} = req.body;

  if(!username || !password){
    return res.status(400).json({message:"Username and password required!"});
  }

  if(!isValid(username)){
    return res.status(401).json({message:"Invalid username"})
  }

  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      username: username,
      exp:Math.floor(Date.now()/1000) + (60*60)
    },jwt_secret);

    req.session.authorization = {
      accessToken: accessToken,
      username: username
    };
    return res.status(200).send("Customer successfully logged in.");
  } else {

    return res.status(208).json({message: "Invalid username or password!"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const review = req.query.review;

  if (!req.session.authorization) {
    return res.status(401).json({ message: "User not logged in!" });
  }

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found!" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required!" });
  }

  // Check if the book already has reviews
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json(`The review for the book with ISBN ${isbn} has been added/updated`);

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req,res)=>{
  // Code for deleting the book review
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  // let filtered_review = [];
  let book = books[isbn];
  if(book.reviews.username === username){
    delete book.reviews[username].review
  }
  return res.status(200).json(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
