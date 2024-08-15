import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';

const API_URL = Platform.OS === 'android' ? process.env.API_URL_ANDROID : process.env.API_URL_DEFAULT;

const AddBook = (props) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [language, setLanguage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleAddBook = async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
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

            if (response.ok) {
                setTitle('');
                setAuthor('');
                setGenre('');
                setLanguage('');
                setModalVisible(true); // Show modal
                setTimeout(() => {
                    setModalVisible(false);
                    props.navigation.navigate('BookList');
                }, 3000);
            } else {
                alert('Failed to add book');
            }
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

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
                    <TouchableOpacity style={styles.button1} onPress={handleAddBook}>
                        <Text style={styles.buttonText}>Add Book</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonSpacing} />
                    <TouchableOpacity style={styles.button2} onPress={() => props.navigation.navigate('BookList')}>
                        <Text style={styles.buttonText}>Go to Book List</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Book added successfully</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    props.navigation.navigate('BookList'); // Navegar a la pantalla de lista de libros
                                }}
                            >
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
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
        backgroundColor: '#ffffff'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonSpacing: {
        width: 10, // Ajusta este valor para aumentar o reducir el espacio entre los botones
    },
    button1: {
        backgroundColor: '#1e702f',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 15,
    },
    modalButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default AddBook;
