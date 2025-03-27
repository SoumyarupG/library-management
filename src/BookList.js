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

  useEffect(() => {
    axios.get('http://localhost:3000/books')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the books!', error);
      });
  }, []);

  const addBook = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/books', newBook)
      .then((response) => {
        setBooks([...books, response.data]);
        setNewBook({ title: '', author: '', genre: '', availabilityStatus: 'Available' });
      })
      .catch((error) => {
        console.error('There was an error adding the book!', error);
      });
  };

  const deleteBook = (id) => {
    axios.delete(`http://localhost:3000/books/${id}`)
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      })
      .catch((error) => {
        console.error('There was an error deleting the book!', error);
      });
  };

  const searchBooks = (e) => {
    e.preventDefault();
    axios.get(`http://localhost:3000/books/search?title=${searchQuery}`)
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('There was an error searching the books!', error);
      });
  };

  return (
    <div>
      <h1>Library Book Management</h1>

      <form onSubmit={addBook}>
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
          onChange={(e) => setNewBook({ ...newBook, availabilityStatus: e.target.value })}
        >
          <option value="Available">Available</option>
          <option value="Checked Out">Checked Out</option>
        </select>
        <button type="submit">Add Book</button>
      </form>

      <form onSubmit={searchBooks}>
        <input
          type="text"
          placeholder="Search by Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.genre}</p>
            <p>{book.availabilityStatus}</p>
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
