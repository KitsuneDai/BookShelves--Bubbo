import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, ImageBackground, Platform } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_URL_ANDROID, API_URL_DEFAULT } from '@env'; // Importa tus variables de entorno

// Define API_URL
const API_URL = Platform.OS === 'android' ? API_URL_ANDROID : API_URL_DEFAULT;

const BookSingle = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { bookId } = route.params;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`${API_URL}/${bookId}`);
                const data = await response.json();
                setBook(data);
            } catch (error) {
                console.error('Error fetching book:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
    }

    if (!book) {
        return <Text>No book found!</Text>;
    }

    return (
        <ImageBackground
            source={require('./../assets/background2.jpg')} // Ruta a la imagen local
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Avatar
                    source={Platform.select({
                        web: { uri: './../assets/book3.jpg' },
                        default: require('./../assets/book3.jpg'),
                    })}
                    containerStyle={styles.avatar}
                    rounded
                />
                <Text style={styles.title}>TITLE: {book.title}</Text>
                <Text style={styles.author}>AUTHOR: {book.author}</Text>
                <Text style={styles.genre}>GENRE: {book.genre}</Text>
                <Text style={styles.language}>LANGUAGE: {book.language}</Text>
                <Button title="Go Back" onPress={() => navigation.goBack()} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            web: {
                width: '100%',
                height: '100%',
            },
        }),
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: add background color for better readability
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom:15,
    },
    author: {
        fontSize: 18,
        marginBottom:15,
    },
    genre: {
        fontSize: 16,
        marginBottom:15,
    },
    language: {
        fontSize: 16,
        marginBottom:20,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        ...Platform.select({
            web: {
                width: 70,
                height: 70,
                borderRadius: 35, // Asegúrate de que la imagen sea redonda
            },
            default: {
                width: 120,
                height: 120,
                borderRadius: 20, // Asegúrate de que la imagen sea redonda
            },
        }),
    },
});

export default BookSingle;
