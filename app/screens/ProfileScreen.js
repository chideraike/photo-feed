import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';

import PhotoList from '../components/photoList';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false
        }
    }

    fetchUserInfo = (userId) => {
        var that = this;
        database.ref('users').child(userId).once('value').then(function(snapshot){
            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();
            that.setState({
                username: data.username,
                name: data.name,
                avatar: data.avatar,
                loggedin: true,
                userId: userId
            });
        });
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if (user) {
                //Logged In
                that.setState({
                    loggedin: true,
                    userId: user.uid
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
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                {this.state.loggedin == true ? (
                    //Is logged in
                    <View style={{ flex: 1 }}>
                        <View style={styles.title}>
                            <Text>My Profile</Text>
                        </View>
                        <View style={styles.nameContainer}>
                            <Image source={{ uri: 'https://api.adorable.io/avatars/285/test@user.i.png' }} style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50 }} />
                            <View style={{ marginRight: 10 }}>
                                <Text>Name</Text>
                                <Text>@username</Text>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('Add')} style={styles.button}>
                                    <Text style={styles.buttonText}>Upload New</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation} />
                    </View>
                ) : (
                        //Not logged in
                        <View style={styles.loggedOut}>
                            <Text>You are not logged in</Text>
                            <Text>Please login to view your profile</Text>
                        </View>
                    )}
            </View>
        );
    }
}

function ProfileScreen(props) {
    const navigation = useNavigation();
    return (
        <Profile {...props} navigation={navigation} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    loggedOut: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        height: 70,
        paddingTop: 30,
        backgroundColor: '#fafafa',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10
    },
    buttonContainer: {
        padding: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey'
    },
    button: {
        borderColor: 'lightgrey',
        borderWidth: 1,
        backgroundColor: '#fff',
        width: 114,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 13
    }
});

export default ProfileScreen;