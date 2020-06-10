import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { f, auth, database, storage } from '../../config/firebaseConfig';

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
        //Load Feed
        this.loadFeed();

    }

    pluralCheck = (s) => {
        if (s == 1) {
            return ' ago';
        } else {
            return 's ago';
        }
    }

    timeConverter = (timestamp) => {
        var a = new Date(timestamp * 1000);
        var seconds = Math.floor((new Date() - a) / 1000);

        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + ' year' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + ' month' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + ' day' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + ' hour' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + ' minute' + this.pluralCheck(interval);
        }
        return Math.floor(seconds) + ' second' + this.pluralCheck(seconds);
    }

    loadFeed = () => {
        this.setState({
            refresh: true,
            photo_feed: []
        });

        var that = this;

        database.ref('photos').orderByChild('posted').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();
            var photo_feed = that.state.photo_feed;
            for (var photo in data) {
                var photoObj = data[photo];
                database.ref('users').child(photoObj.author).child('username').once('value').then(function (snapshot) {
                    const exists = (snapshot.val() !== null);
                    if (exists) data = snapshot.val();
                    photo_feed.push({
                        id: photo,
                        url: photoObj.url,
                        caption: photoObj.caption,
                        posted: that.timeConverter(photoObj.posted),
                        author: data,
                        authorId: photoObj.author
                    });

                    that.setState({
                        refresh: false,
                        loading: false
                    });
                }).catch(error => console.log(error));
            }
        }).catch(error => console.log(error));
    }

    loadNew = () => {
        //Load Feed
        this.loadFeed();
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text>Feed</Text>
                </View>

                {this.state.loading === true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Loading ...</Text>
                    </View>
                ) : (
                        <FlatList
                            refreshing={this.state.refresh}
                            onRefresh={this.loadNew}
                            data={this.state.photo_feed}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ flex: 1, backgroundColor: '#fff' }}
                            renderItem={({ item, index }) => (
                                <View key={index} style={styles.postContainer}>
                                    <View style={styles.postTitle}>
                                        <Text>{item.posted}</Text>
                                        <TouchableOpacity style={styles.author} onPress={() => navigation.navigate('User', { userId: item.authorId })}>
                                            <Text>@{item.author}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Image source={{ uri: item.url }} style={styles.image} />
                                    </View>
                                    <View style={{ padding: 5 }}>
                                        <Text>{item.caption}</Text>
                                        <View style={{ alignItems: "center", justifyContent: 'center', paddingVertical: 4 }}>
                                            <TouchableOpacity style={styles.comments} onPress={() => navigation.navigate('Comments', { userId: item.id })}>
                                                <Text style={{ textAlign: 'center' }}>View Comments</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    )}
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