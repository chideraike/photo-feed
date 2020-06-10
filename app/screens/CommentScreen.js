import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { f, auth, database, storage } from '../../config/firebaseConfig';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false
        }
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
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loggedin == true ? (
                    //Is logged in
                    <Text>Comments</Text>
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default CommentScreen;