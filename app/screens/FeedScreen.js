import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { f, auth, database, storage } from '../../config/firebaseConfig';

import PhotoList from '../components/photoList';

class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photo_feed: [],
            refresh: false,
            loading: true
        }
    }

    componentDidMount = () => {
        
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Feed</Text>
                </View>

                <PhotoList isUser={false} navigation={this.props.navigation} />
            </View>
        );
    }
}

function FeedScreen(props) {
    const navigation = useNavigation();
    return (
        <Feed {...props} navigation={navigation} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        height: 70,
        paddingTop: 30,
        backgroundColor: '#fafafa',
        borderBottomColor: '#000000',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 20
    },
    image: {
        resizeMode: 'cover',
        width: '100%',
        height: 275
    },
    postContainer: {
        width: '100%',
        overflow: 'hidden',
        marginBottom: 5,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    postTitle: {
        padding: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    author: {
        backgroundColor: '#fafafa',
        borderColor: '#fafafa',
        borderWidth: 0.5,
        paddingHorizontal: 5,
        paddingVertical: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        shadowRadius: 1,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 5
    },
    comments: {
        backgroundColor: '#fafafa',
        borderColor: '#fafafa',
        borderWidth: 0.5,
        paddingHorizontal: 10,
        paddingVertical: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 5
    }
});

export default FeedScreen;