import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Platform, Modal, Button } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = Platform.OS === 'android' ? process.env.API_URL_ANDROID : process.env.API_URL_DEFAULT;

const BooksList = (props) => {
    const [books, setBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchBooks = useCallback(async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBooks();
        }, [fetchBooks])
    );

    const handleDelete = async () => {
        if (selectedBookId) {
            try {
                const response = await fetch(`${API_URL}/${selectedBookId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Refresh the list of books after deletion
                fetchBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
            }
            setModalVisible(false);
            setSelectedBookId(null);
        }
    };

    const handleAvatarPress = (bookId) => {
        props.navigation.navigate('BookSingle', { bookId });
    };

    const openDeleteModal = (bookId) => {
        setSelectedBookId(bookId);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <ListItem bottomDivider>
            <TouchableOpacity onPress={() => handleAvatarPress(item.id)}>
                <Avatar
                    source={Platform.select({
                        web: { uri: './../assets/book3.jpg' },
                        default: require('./../assets/book3.jpg'),
                    })}
                    containerStyle={styles.avatar}
                    rounded
                />
            </TouchableOpacity>
            <ListItem.Content>
                <ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
                <ListItem.Subtitle style={styles.subtitle}>{item.author}</ListItem.Subtitle>
                <ListItem.Subtitle style={styles.subtitle}>{item.genre}</ListItem.Subtitle>
                <ListItem.Subtitle style={styles.subtitle}>{item.language}</ListItem.Subtitle>
            </ListItem.Content>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => openDeleteModal(item.id)} style={styles.iconButton}>
                    <Icon name="trash" size={20} style={styles.iconDelete} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('BookDetails', { bookId: item.id })} style={styles.iconButton}>
                    <Icon name="pencil" size={20} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </ListItem>
    );

    const handlePressCreateBook = () => {
        props.navigation.navigate('AddBook');
    };

    return (
        <ImageBackground
            source={require('./../assets/background1.jpg')}
            style={styles.container}
        >
            <TouchableOpacity style={styles.button} onPress={handlePressCreateBook}>
                <Text style={styles.buttonText}>Create new book</Text>
            </TouchableOpacity>

            <FlatList
                data={books}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                style={styles.flatList}
            />

            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Delete Book</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to delete this book?</Text>
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} buttonStyle={styles.modalButton} />
                            <Button title="Delete" onPress={handleDelete} buttonStyle={[styles.modalButton, styles.modalButtonDelete]} />
                        </View>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
};

// Define los estilos comunes y específicos para plataformas
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            web: {
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
            },
        }),
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    flatList: {
        width: '80%',
        ...Platform.select({
            web: {
                width: '50%',
            },
        }),
    },
    button: {
        backgroundColor: '#1e702f',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        ...Platform.select({
            web: {
                padding: 20,
                marginBottom: 10,
            },
        }),
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        ...Platform.select({
            web: {
                fontSize: 18,
            },
        }),
    },
    title: {
        ...Platform.select({
            web: {
                fontSize: 16,
            },
            default: {
                fontSize: 12,
            },
        }),
    },

    subtitle: {
        ...Platform.select({
            web: {
                fontSize: 12,
            },
            default: {
                fontSize: 10,
            },
        }),
    },
    icon: {
        marginHorizontal: 10,
        color: '#312ea3',
    },
    iconDelete: {
        marginHorizontal: 10,
        color: '#ff0000',
    },
    avatar: {
        ...Platform.select({
            web: {
                width: 70,
                height: 70,
                borderRadius: 35,
            },
            default: {
                width: 40,
                height: 40,
                borderRadius: 20,
            },
        }),
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
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
        width: '45%',
    },
    modalButtonDelete: {
        backgroundColor: '#ff0000',
    },
});

export default BooksList;
