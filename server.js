const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");


const serviceAccount = require("./serviceAccountKey");


admin.initializeApp({

    credential: admin.credential.cert(serviceAccount)

});

const db = admin.firestore();
const app = express();

app.use(cors({
    origin: '*', // Permite solicitudes desde cualquier origen. Ajusta según sea necesario.
}));
app.use(bodyParser.json());

// Endpoint para obtener todos los libros
app.get('/books', async (req, res) => {
    try {
        const booksCollection = db.collection('books');
        const snapshot = await booksCollection.get();
        const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books');
    }
});

// Endpoint para obtener un libro por ID
app.get('/books/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const bookDoc = db.collection('books').doc(bookId);
        const doc = await bookDoc.get();
        if (!doc.exists) {
            res.status(404).send('Book not found');
        } else {
            res.json({ id: doc.id, ...doc.data() });
        }
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).send('Error fetching book');
    }
});

// Endpoint para agregar un nuevo libro
app.post('/books', async (req, res) => {
    try {
        const { title, author, genre, language } = req.body;
        if (!title || !author || !genre || !language) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newBook = { title, author, genre, language };
        const docRef = await db.collection('books').add(newBook);
        res.status(201).json({ message: 'Book added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding book' });
    }
});

app.put('/books/:id', async (req, res) => {
    console.log('PUT request received for book ID:', req.params.id);
    try {
        const bookId = req.params.id;
        const { title, author, genre, language } = req.body;

        // Check if all required fields are provided
        if (!title || !author || !genre || !language) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get reference to the book document
        const bookRef = db.collection('books').doc(bookId);
        const doc = await bookRef.get();

        // Check if the book exists
        if (!doc.exists) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Update the book
        await bookRef.update({ title, author, genre, language });

        // Send a successful response with just the success message
        res.status(200).json({ message: 'Book updated successfully' });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Error updating book' });
    }
});



app.delete('/books/:id', async (req, res) => {
    try {
        const bookId = req.params.id;

        // Verifica si el libro existe antes de intentar eliminarlo
        const bookRef = db.collection('books').doc(bookId);
        const doc = await bookRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Elimina el libro
        await bookRef.delete();

        res.status(200).send('Book deleted successfully');
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Error deleting book' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
