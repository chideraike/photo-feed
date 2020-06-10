import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, KeyboardAvoidingViewBase } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { f, auth, database, storage } from '../../config/firebaseConfig';
import { Icon } from 'react-native-eva-icons';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            comments_list: []
        }
    }

    checkParams = () => {
        //
        var params = this.props.route.params;
        if (params) {
            if (params.photoId) {
                this.setState({
                    photoId: params.photoId
                });
                this.fetchComments(params.photoId);
            }
        }
    }

    addCommentToList = (comments_list, data, comment) => {
        var that = this;
        var commentObj = data[comment];
        database.ref('users').child(commentObj.author).child('username').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();

            comments_list.push({
                id: comment,
                comment: commentObj.comment,
                posted: that.timeConverter(commentObj.posted),
                author: data,
                authorId: commentObj.author
            });

            that.setState({
                refresh: false,
                loading: false
            });
        }).catch(error => console.log(error));
    }

    fetchComments = (photoId) => {
        var that = this;

        database.ref('comments').child(photoId).orderByChild('posted').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) {
                // add comments to flatlist
                data = snapshot.val();
                var comments_list = that.state.comments_list;

                for (var comment in data) {
                    that.addCommentToList(comments_list, data, comment);
                }
            } else {
                // are no comments_list
                that.setState({
                    comments_list: []
                });
            }
        }).catch(error => console.log(error));
    }

    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
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

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if (user) {
                //Logged In
                that.setState({
                    loggedin: true
                });
            } else {
                //Not logged In
                that.setState({
                    loggedin: false
                });
            }
        });

        this.checkParams();
    }

    postComment = () => {
        var comment = this.state.comment;
        if (comment != '') {
            // process
            var imageId = this.state.photoId;
            var userId = f.auth().currentUser.uid;
            var commentId = this.uniqueId();
            var dateTime = Date.now();
            var timestamp = Math.floor(dateTime / 1000);

            this.setState({
                comment: ''
            });

            var commentObj = {
                posted: timestamp,
                author: userId,
                comment: comment
            }

            database.ref('/comments/' + imageId + '/' + commentId).set(commentObj);

            // reload comment
            this.reloadCommentList();
        } else {
            alert('Please enter a comment before posting.');
        }
    }

    reloadCommentList = () => {
        this.setState({
            comments_list: []
        });
        this.fetchComments(this.state.photoId);
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name='chevron-up-outline' height={30} width={30} fill="#000000" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.titleText}>Comments</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.postComment()}>
                        <Icon name='message-square-outline' height={30} width={30} fill="#000000" />
                    </TouchableOpacity>
                </View>
                {this.state.comments_list.length == 0 ? (
                    // no comments show empty state
                    <Text>No Comments found ...</Text>
                ) : (
                        // are comments
                        <FlatList
                            refreshing={this.state.refresh}
                            data={this.state.comments_list}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ flex: 1, backgroundColor: '#eee' }}
                            renderItem={({ item, index }) => (
                                <View key={index} style={{ width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey' }}>
                                    <View style={{ padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text>{item.posted}</Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('User', { userId: item.authorId })}>
                                            <Text>{item.author}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ padding: 5 }}>
                                        <Text>{item.comment}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    )}
                {this.state.loggedin == true ? (
                    //Is logged in
                    <KeyboardAvoidingView behavior='padding' enabled style={{ borderTopWidth: 1, borderTopColor: 'grey', padding: 10, marginBottom: 15 }}>
                        <Text style={{ fontWeight: 'bold' }}>Post Comment</Text>
                        <View>
                            <TextInput
                                editable={true}
                                placeholder={'Enter your comment here ...'}
                                onChangeText={(text) => this.setState({ comment: text })}
                                value={this.state.comment}
                                style={{ marginVertical: 10, height: 50, padding: 5, borderColor: 'grey', borderRadius: 3, backgroundColor: 'white', color: 'black' }}
                            />
                            <TouchableOpacity onPress={() => this.postComment()} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'blue', borderRadius: 5 }}>
                                <Text style={{ color: 'white' }}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                ) : (
                        //Not logged in
                        <View>
                            <Text>You are not logged in</Text>
                            <Text>Please login to post a comment</Text>
                        </View>
                    )}
            </View>
        );
    }
}

function CommentScreen(props) {
    const navigation = useNavigation();
    const route = useRoute();
    return (
        <Comment {...props} navigation={navigation} route={route} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        height: 70,
        paddingTop: 30,
        backgroundColor: '#fff',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 20
    }
});

export default CommentScreen;