package com.library.service;

import com.library.model.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // Retrieve all books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Retrieve a book by ID
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    // Search books by title (case insensitive)
    public List<Book> searchBooksByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    // Add a new book with validation
    @Transactional
    public Book addBook(Book book) {
        if (bookRepository.existsById(book.getId())) {
            throw new RuntimeException("Book with this ID already exists!");
        }
        return bookRepository.save(book);
    }

    // Update book details
    @Transactional
    public Book updateBook(Long id, Book bookDetails) {
        return bookRepository.findById(id).map(existingBook -> {
            if (bookDetails.getTitle() != null && !bookDetails.getTitle().isEmpty()) {
                existingBook.setTitle(bookDetails.getTitle());
            }
            if (bookDetails.getAuthor() != null && !bookDetails.getAuthor().isEmpty()) {
                existingBook.setAuthor(bookDetails.getAuthor());
            }
            if (bookDetails.getGenre() != null && !bookDetails.getGenre().isEmpty()) {
                existingBook.setGenre(bookDetails.getGenre());
            }
            if (bookDetails.getAvailabilityStatus() != null) {
                existingBook.setAvailabilityStatus(bookDetails.getAvailabilityStatus());
            }
            return bookRepository.save(existingBook);
        }).orElseThrow(() -> new RuntimeException("Book with ID " + id + " not found."));
    }

    // Delete book by ID
    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book with ID " + id + " not found.");
        }
        bookRepository.deleteById(id);
    }
}
