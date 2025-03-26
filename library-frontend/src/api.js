// src/api.js
import axios from 'axios';

// Use an environment variable to determine the API base URL.
// Create a .env file at the root of your React project and add:
// REACT_APP_API_URL=https://your-backend-app.onrender.com
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getAllBooks = () => axios.get(`${API_URL}/books`);
export const getBookById = (id) => axios.get(`${API_URL}/books/${id}`);
export const searchBooks = (title) => axios.get(`${API_URL}/books/search?title=${title}`);
export const addBook = (book) => axios.post(`${API_URL}/books`, book);
export const updateBook = (id, bookDetails) => axios.put(`${API_URL}/books/${id}`, bookDetails);
export const deleteBook = (id) => axios.delete(`${API_URL}/books/${id}`);
