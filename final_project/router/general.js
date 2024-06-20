const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  const doesExist = (username)=>{
    let sameUser = users.filter((user)=>{
      return user.username === username
    });
    if(sameUser.length > 0){
      return true;
    } else{
      return false;
    }
  }

  if(username && password){
    if(!doesExist(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message:"Customer successfully registered.Now you can login."})
    } else{
      return res.status(404).json({message:"User already exist!"});
    }
  }
  return res.status(404).json({message: "Unable to register user!"});
});



// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  /* res.send(JSON.stringify({books},null,4))
  return res.status(200).json({message: "Request successful"});*/
  // Using Promise callbacks
  let myPromise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve({books});
    },1000);
  })
  myPromise.then((data)=>{
    res.status(200).send(JSON.stringify(data,null,4));
  })
  .catch((err)=>{
    res.status(500).send(JSON.stringify({message:"Interval Server Error"}))
  })
}); 
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
  /*res.send(books[isbn])
  return res.status(300).json({message: "Request successful"}); */
  // using Promise callbacks
  let myPromise = new Promise((resolve,reject)=>{
    if(books[isbn]){
      resolve(books[isbn]);
    } else{
      reject({message:"Book not found"});
    }
  })
  myPromise.then((data)=>{
    res.status(200).send(data);
  }).catch((err)=>{
    res.status(404).json(err);
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here  
    const author = req.params.author;
    let booksbyauthor = []; 
  /* for (let isbn in books){
    if(books[isbn].author === author){
      let book = books[isbn];
      booksbyauthor.push({
        isbn,
        title:book.title,
        reviews:book.reviews
      });
    }
  }
  res.send({booksbyauthor});
  return res.status(200).json({message: "Yet to be implemented"}); */
  // Using Promise callbacks
  const myPromise = new Promise((resolve, reject) => {
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
    resolve({booksbyauthor});
    reject({message:"Author not found"})
  });
  myPromise.then((data)=>{
    res.status(200).send(data);
  }).catch((err)=>{
    res.status(500).json(err);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksbytitle = [];
  /* for(let isbn in books){
    if(books[isbn].title === title){
      let book = books[isbn];
      booksbytitle.push({
        isbn,
        author:book.author,
        reviews:book.reviews
      });
    }
  }
  res.send({booksbytitle});
  return res.status(300).json({message: "Yet to be implemented"}); */
  // Using Promise callbacks
  const myPromise = new Promise((resolve, reject) => {
    for (let isbn in books){
      if(books[isbn].title === title){
        let book = books[isbn];
        booksbytitle.push({
          isbn,
          author:book.author,
          reviews:book.reviews
        });
      }
    }
    resolve({booksbytitle});
    reject({message:"Title not found"})
  });
  myPromise.then((data)=>{
    res.status(200).send(data);
  }).catch((err)=>{
    res.status(500).json(err);
  });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)

  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
