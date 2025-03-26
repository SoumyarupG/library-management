import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    id: '', // Book ID (optional, but handled properly)
    title: '',
    author: '',
    genre: '',
    availabilityStatus: 'Available',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchById, setSearchById] = useState('');
  const [idError, setIdError] = useState(''); // To hold the ID validation error message

  // Fetch all books from backend when the component mounts
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/books`)
      .then((response) => setBooks(response.data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  // Add a new book
  const addBook = (e) => {
    e.preventDefault();

    // Validate if the ID is a valid number or not before adding
    if (newBook.id && isNaN(newBook.id)) {
      setIdError('Please provide a valid numeric ID if you wish to use one.');
      return;
    } else {
      setIdError('');
    }

    // Check if the provided ID already exists in the backend before adding
    if (newBook.id) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/books/${newBook.id}`)
        .then((response) => {
          // If response exists, it means the ID already exists
          if (response.data) {
            setIdError('Book ID already exists. Please provide a unique ID.');
          } else {
            // Proceed to add the book if the ID is unique
            submitNewBook();
          }
        })
        .catch(() => {
          // If the book doesn't exist, add the book
          submitNewBook();
        });
    } else {
      // If no ID is provided, just submit the new book
      submitNewBook();
    }
  };

  // Function to submit the new book if the ID is unique
  const submitNewBook = () => {
    // Clear search inputs when adding a new book
    setSearchQuery('');
    setSearchById('');

    // Add book to the backend
    axios
      .post(`${process.env.REACT_APP_API_URL}/books`, newBook)
      .then((response) => {
        setBooks([...books, response.data]);
        setNewBook({
          id: '',
          title: '',
          author: '',
          genre: '',
          availabilityStatus: 'Available',
        });
      })
      .catch((error) => console.error('Error adding book:', error));
  };

  // Search books by title or ID
  const searchBooks = (e) => {
    e.preventDefault();
    let query = '';

    if (searchById) {
      query = `id=${searchById}`;
    } else if (searchQuery) {
      query = `title=${searchQuery}`;
    }

    if (query) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/books/search?${query}`)
        .then((response) => setBooks(response.data))
        .catch((error) => console.error('Error searching books:', error));
    }
  };

  // Delete a book
  const deleteBook = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/books/${id}`)
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      })
      .catch((error) => console.error('Error deleting book:', error));
  };

  return (
    <div>
      <h1>Library Book Management</h1>

      {/* Add Book Form */}
      <form onSubmit={addBook}>
        <input
          type="text"
          placeholder="Book ID (optional)"
          value={newBook.id}
          onChange={(e) => setNewBook({ ...newBook, id: e.target.value })}
        />
        {idError && <p style={{ color: 'red' }}>{idError}</p>} {/* Show ID error */}
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
          required
        />
        <select
          value={newBook.availabilityStatus}
          onChange={(e) =>
            setNewBook({ ...newBook, availabilityStatus: e.target.value })
          }
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

        <input
          type="text"
          placeholder="Search by ID"
          value={searchById}
          onChange={(e) => setSearchById(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {/* Book List */}
      <ul>
        {books.map((book) => (
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
