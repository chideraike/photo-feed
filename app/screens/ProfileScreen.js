import React from 'react';
import { TextInput, TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-eva-icons';

import PhotoList from '../components/photoList';
import UserAuth from '../components/auth';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false
        }
    }

    fetchUserInfo = (userId) => {
        var that = this;
        database.ref('users').child(userId).once('value').then(function (snapshot) {
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
                that.fetchUserInfo(user.uid);
            } else {
                //Not logged In
                that.setState({
                    loggedin: false
                });
            }
        });
    }

    saveProfile = () => {
        var name = this.state.name;
        var username = this.state.username;

        if (name !== '') {
            if (username !== '') {
                database.ref('users').child(this.state.userId).child('username').set(username);
            } else {
                alert('Enter a username');
                return;
            }
            database.ref('users').child(this.state.userId).child('name').set(name);
        } else {
            alert('Enter a name');
            return;
        }
        this.setState({ editingProfile: false })
    }

    closeEditing = () => {
        this.setState({ editingProfile: false });
    }

    logoutUser = () => {
        f.auth().signOut();
        alert('Logged Out');
    }

    editProfile = () => {
        this.setState({
            editingProfile: true
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
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>My Profile</Text>
                        </View>
                        <View style={styles.nameContainer}>
                            <Image source={{ uri: this.state.avatar }} style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50 }} />
                            <View style={{ marginRight: 10, alignItems: 'center' }}>
                                <Text style={{ fontSize: 30 }}>{this.state.name}</Text>
                                <Text>{this.state.username}</Text>
                            </View>
                        </View>
                        {this.state.editingProfile == true ? (
                            <View style={styles.editProfileContainer}>
                                <View style={styles.editProfile}>
                                    <View style={styles.editProfileTitle}>
                                        <TouchableOpacity onPress={() => this.closeEditing()}>
                                            <Icon name='close-outline' height={30} width={30} fill="#FF0000" />
                                        </TouchableOpacity>
                                        <Text style={{ fontWeight: 'bold' }}>Edit Profile</Text>
                                        <TouchableOpacity onPress={() => this.saveProfile()}>
                                            <Icon name='checkmark-outline' height={30} width={30} fill="#0000FF" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignSelf: 'center' }}>
                                        <View style={styles.editProfileInputContainer}>
                                            <Text>Name:</Text>
                                            <TextInput
                                                editable={true}
                                                placeholder={'Enter your name'}
                                                maxLength={25}
                                                onChangeText={(text) => this.setState({ name: text })}
                                                value={this.state.name}
                                                style={styles.editProfileInput}
                                            />
                                        </View>
                                        <View style={styles.editProfileInputContainer}>
                                            <Text>Username:</Text>
                                            <TextInput
                                                editable={true}
                                                placeholder={'Enter your username'}
                                                maxLength={25}
                                                onChangeText={(text) => this.setState({ username: text })}
                                                value={this.state.username}
                                                style={styles.editProfileInput}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ) : (
                                <View style={styles.buttonContainer}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Add')} style={styles.uploadButton}>
                                            <Icon name='cloud-upload-outline' height={30} width={30} fill="#FFF" />
                                            <Text style={styles.uploadButtonText}>Upload New</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button} onPress={() => this.editProfile()}>
                                            <Icon name='edit-outline' height={30} width={30} fill="#000000" />
                                            <Text style={styles.buttonText}>Edit Profile</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.logoutButton} onPress={() => this.logoutUser()}>
                                            <Icon name='log-out-outline' height={30} width={30} fill="#FFF" />
                                            <Text style={styles.logoutButtonText}>Logout</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation} />
                    </View>
                ) : (
                        //Not logged in
                        <UserAuth message={'Please login to view your profile'} />
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
    title: {
        height: 70,
        paddingTop: 30,
        backgroundColor: '#fafafa',
        borderBottomColor: 'black',
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
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor: '#fff',
        width: 114,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 10
    },
    logoutButton: {
        borderColor: 'red',
        borderWidth: 1,
        backgroundColor: 'red',
        width: 114,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    logoutButtonText: {
        fontWeight: 'bold',
        fontSize: 10,
        color: 'white'
    },
    uploadButton: {
        borderColor: 'blue',
        borderWidth: 1,
        backgroundColor: 'blue',
        width: 114,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    uploadButtonText: {
        fontWeight: 'bold',
        fontSize: 10,
        color: 'white'
    },
    editProfileContainer: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
        width: '100%',
        padding: 10
    },
    editProfile: {
        padding: 5,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5
    },
    editProfileTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    editProfileInput: {
        width: 200,
        marginVertical: 10,
        padding: 5,
        paddingHorizontal: 15,
        borderColor: 'grey',
        borderWidth: 1,
        marginLeft: 10
    },
    editProfileInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default ProfileScreen;