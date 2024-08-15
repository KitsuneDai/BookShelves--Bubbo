import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';

const API_URL = Platform.OS === 'android' ? process.env.API_URL_ANDROID : process.env.API_URL_DEFAULT;


const BookDetails = (props) => {
    const [book, setBook] = useState(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [language, setLanguage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const { bookId } = props.route.params;

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`${API_URL}/${bookId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBook(data);
                setTitle(data.title);
                setAuthor(data.author);
                setGenre(data.genre);
                setLanguage(data.language);
            } catch (error) {
                console.error('Error fetching book:', error);
                setMessage('Failed to fetch book details.');
                setMessageType('error');
            }
        };

        fetchBook();
    }, [bookId]);

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${API_URL}/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    author,
                    genre,
                    language,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setMessage('Book updated successfully');
            setMessageType('success');

            // Redirigir después de 3 segundos
            setTimeout(() => {
                props.navigation.goBack();
            }, 3000);
        } catch (error) {
            console.error('Error updating book:', error);
            setMessage('Failed to update book.');
            setMessageType('error');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/${bookId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setModalVisible(false);
            setMessage('Book deleted successfully');
            setMessageType('success');

            // Redirigir después de 3 segundos
            setTimeout(() => {
                props.navigation.goBack();
            }, 3000);
        } catch (error) {
            console.error('Error deleting book:', error);
            setMessage('Failed to delete book.');
            setMessageType('error');
        }
    };

    if (!book) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.backgroundImage}
        >
            <ImageBackground
                source={require('./../assets/background4.jpg')} // Ruta a la imagen local
                style={styles.container}
            >
                <TextInput
                    style={styles.input}
                    placeholder='Title'
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Author'
                    value={author}
                    onChangeText={setAuthor}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Genre'
                    value={genre}
                    onChangeText={setGenre}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Language'
                    value={language}
                    onChangeText={setLanguage}
                />

                {/* Contenedor para los botones */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button1} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>Update Book</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonSpacing} />
                    <TouchableOpacity style={[styles.button2, { backgroundColor: 'red' }]} onPress={() => setModalVisible(true)}>
                        <Text style={styles.buttonText}>Delete Book</Text>
                    </TouchableOpacity>
                </View>

                {/* Mostrar el mensaje en la interfaz */}
                {message ? (
                    <Text style={[styles.message, messageType === 'success' ? styles.success : styles.error]}>
                        {message}
                    </Text>
                ) : null}

                {/* Modal for confirmation */}
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Confirm Delete</Text>
                            <Text style={styles.modalMessage}>Are you sure you want to delete this book?</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={handleDelete}>
                                    <Text style={styles.modalButtonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        ...Platform.select({
            web: {
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
            },
        }),
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    message: {
        marginTop: 15,
        fontSize: 16,
        textAlign: 'center',
    },
    success: {
        color: 'green',
    },
    error: {
        color: 'red',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonSpacing: {
        width: 10,
    },
    button1: {
        backgroundColor: '#10aa0a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button2: {
        backgroundColor: '#78807d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default BookDetails;
