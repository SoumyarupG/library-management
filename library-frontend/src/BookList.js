// src/BookList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    availabilityStatus: 'Available'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all books from backend when the component mounts
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/books`)
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  // Add a new book
  const addBook = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/books`, newBook)
      .then(response => {
        setBooks([...books, response.data]);
        setNewBook({ title: '', author: '', genre: '', availabilityStatus: 'Available' });
      })
      .catch(error => console.error('Error adding book:', error));
  };

  // Delete a book
  const deleteBook = (id) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/books/${id}`)
      .then(() => setBooks(books.filter(book => book.id !== id)))
      .catch(error => console.error('Error deleting book:', error));
  };

  // Search books by title
  const searchBooks = (e) => {
    e.preventDefault();
    axios.get(`${process.env.REACT_APP_API_URL}/books/search?title=${searchQuery}`)
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error searching books:', error));
  };

  return (
    <div>
      <h1>Library Book Management</h1>
      
      {/* Add Book Form */}
      <form onSubmit={addBook}>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({...newBook, title: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({...newBook, author: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
          required
        />
        <select
          value={newBook.availabilityStatus}
          onChange={(e) => setNewBook({...newBook, availabilityStatus: e.target.value})}
        >
          <option value="Available">Available</option>
          <option value="Checked Out">Checked Out</option>
        </select>
        <button type="submit">Add Book</button>
      </form>

      {/* Search Books */}
      <form onSubmit={searchBooks}>
        <input
          type="text"
          placeholder="Search by Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Book List */}
      <ul>
        {books.map(book => (
          <li key={book.id}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Status: {book.availabilityStatus}</p>
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
