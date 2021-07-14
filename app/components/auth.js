import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { f, auth, database, storage } from '../../config/firebaseConfig';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-eva-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class UserAuthScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authStep: 0,
            name: '',
            username: '',
            email: '',
            pass: '',
            avatarId: this.uniqueId(),
            avatarSelected: false,
            uploading: false,
            progress: 0
        }
    }

    _checkPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ camera: status });

        const { statusRoll } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        this.setState({ cameraRoll: statusRoll });
    }

    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    findNewAvatar = async () => {
        this._checkPermissions();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });

        console.log(result);

        if (!result.cancelled) {
            console.log('upload image');
            this.setState({
                avatarSelected: true,
                avatarId: this.uniqueId(),
                uri: result.uri
            });
            // this.uploadImage(result.uri);
        } else {
            console.log('cancel');
            this.setState({
                avatarSelected: false
            });
        }
    }

    uploadImage = async (uri) => {
        var that = this;
        var userId = f.auth().currentUser.uid;
        var avatarId = this.state.avatarId;

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];
        this.setState({
            currentFileType: ext,
            uploading: true
        });

        const response = await fetch(uri);
        const blob = await response.blob();
        var FilePath = avatarId + '.' + that.state.currentFileType;

        var uploadTask = storage.ref('user/' + userId + '/avatar').child(FilePath).put(blob);

        uploadTask.on('state_changed', function (snapshot) {
            var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            console.log('Upload is ' + progress + '% complete');
            that.setState({
                progress: progress
            });
        }, function (error) {
            console.log('Error with upload - ' + error);
        }, function () {
            // complete
            that.setState({ progress: 100 });
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log(downloadURL);
                that.processUpload(downloadURL);
            });
        });
    }

    processUpload = (imageUrl) => {
        // Set needed info
        var userId = f.auth().currentUser.uid;

        // Set user photos object
        database.ref('/users/' + userId + '/avatar/').set(imageUrl);

        this.setState({
            uploading: false,
            avatarSelected: false,
            uri: ''
        });
    }

    uploadPublish = () => {
        if (this.state.uploading == false) {
            this.uploadImage(this.state.uri);
        } else {
            console.log('Ignore button tap as already uploading');
        }
    }

    createUserObj = (userObj, name, username, email) => {
        console.log(userObj, name, username, email, userObj.uid);

        var uObj = {
            name: name,
            username: username,
            email: email
        }
        database.ref('users').child(userObj.uid).set(uObj);
    }

    signup = async () => {
        //Force user to login
        var name = this.state.name;
        var username = this.state.username;
        var email = this.state.email;
        var pass = this.state.pass;

        if (email != '' && pass != '') {
            try {
                let user = await auth.createUserWithEmailAndPassword(email, pass)
                    .then((userObj) => this.createUserObj(userObj.user, name, username, email))
                    .catch((error) => alert(error));
                this.uploadPublish();
            } catch (error) {
                console.log(error);
                alert(error);
            }
        } else {
            alert('Some fields are empty');
        }
    }

    login = async () => {
        //Force user to login
        var email = this.state.email;
        var pass = this.state.pass;

        if (email != '' && pass != '') {
            try {
                let user = await auth.signInWithEmailAndPassword(email, pass); // 'test@user.com', 'password')
            } catch (error) {
                console.log(error);
                alert(error);
            }
        } else {
            alert('Email or password is empty');
        }
    }

    componentDidMount = () => {

    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Text>You are not logged in</Text>
                <Text>{this.props.message}</Text>
                {this.state.authStep == 0 ? (
                    <View style={{ marginVertical: 20, flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.setState({ authStep: 1 })}>
                            <Text style={{ fontWeight: 'bold', color: 'green' }}>Login</Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10 }}>or</Text>
                        <TouchableOpacity onPress={() => this.setState({ authStep: 2 })}>
                            <Text style={{ fontWeight: 'bold', color: 'blue' }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ marginVertical: 20 }}>
                        {this.state.authStep == 1 ? (
                            // Login
                            <View>
                                <View style={styles.loginTitle}>
                                    <TouchableOpacity onPress={() => this.setState({ authStep: 0 })}>
                                        <Icon name='arrow-back-outline' height={30} width={30} fill="#808080" />
                                    </TouchableOpacity>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Login</Text>
                                    <TouchableOpacity onPress={() => this.login()}>
                                        <Icon name='log-in-outline' height={30} width={30} fill="#008000" />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text>Email Address:</Text>
                                    <TextInput
                                        editable={true}
                                        keyboardType={'email-address'}
                                        autoCapitalize={"none"}
                                        placeholder={'Enter your email address'}
                                        onChangeText={(text) => this.setState({ email: text })}
                                        value={this.state.email}
                                        style={styles.loginInput}
                                    />
                                </View>
                                <View>
                                    <Text>Password:</Text>
                                    <TextInput
                                        editable={true}
                                        secureTextEntry={true}
                                        placeholder={'Enter your password'}
                                        onChangeText={(text) => this.setState({ pass: text })}
                                        value={this.state.pass}
                                        style={styles.loginInput}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => this.login()} style={styles.loginButton}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            // Sign Up
                            <View>
                                <View style={styles.signupTitle}>
                                    <TouchableOpacity onPress={() => this.setState({ authStep: 0 })}>
                                        <Icon name='arrow-back-outline' height={30} width={30} fill="#808080" />
                                    </TouchableOpacity>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Sign Up</Text>
                                    <TouchableOpacity onPress={() => this.signup()}>
                                        <Icon name='checkmark-circle-outline' height={30} width={30} fill="#0000FF" />
                                    </TouchableOpacity>
                                </View>
                                <KeyboardAwareScrollView>
                                    <View>
                                        {this.state.avatarSelected == true ? (
                                            <View style={{ width: 300, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 10 }}>
                                                <View style={{ height: 75, width: 75, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image source={{ uri: this.state.uri }} style={styles.uploadingImage} />
                                                </View>
                                                <Text>Profile picture selected</Text>
                                                <TouchableOpacity onPress={() => this.setState({ avatarSelected: false })}>
                                                    <Icon name='close-outline' height={30} width={30} fill="#000000" />
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 10 }}>
                                                <TouchableOpacity onPress={() => this.findNewAvatar()} style={{ height: 75, width: 75, backgroundColor: 'lightgrey', borderRadius: 75, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Icon name='person-outline' height={30} width={30} fill="#FFF" />
                                                </TouchableOpacity>
                                                <Text>Select a profile pic</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={{ alignSelf: 'center' }}>
                                        <View>
                                            <Text>Name:</Text>
                                            <TextInput
                                                editable={true}
                                                keyboardType={'default'}
                                                placeholder={'Enter your name'}
                                                onChangeText={(text) => this.setState({ name: text })}
                                                value={this.state.name}
                                                style={styles.signupInput}
                                            />
                                        </View>
                                        <View>
                                            <Text>Username:</Text>
                                            <TextInput
                                                editable={true}
                                                keyboardType={'default'}
                                                placeholder={'Enter your username'}
                                                onChangeText={(text) => this.setState({ username: text })}
                                                value={this.state.username}
                                                style={styles.signupInput}
                                            />
                                        </View>
                                        <View>
                                            <Text>Email Address:</Text>
                                            <TextInput
                                                editable={true}
                                                keyboardType={'email-address'}
                                                autoCapitalize={'none'}
                                                placeholder={'Enter your email address'}
                                                onChangeText={(text) => this.setState({ email: text })}
                                                value={this.state.email}
                                                style={styles.signupInput}
                                            />
                                        </View>
                                        <View>
                                            <Text>Password:</Text>
                                            <TextInput
                                                editable={true}
                                                secureTextEntry={true}
                                                placeholder={'Enter your password'}
                                                onChangeText={(text) => this.setState({ pass: text })}
                                                value={this.state.pass}
                                                style={styles.signupInput}
                                            />
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => this.signup()} style={styles.signupButton}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign Up</Text>
                                    </TouchableOpacity>
                                    {this.state.uploading == true ? (
                                        <View style={{ marginTop: 10, flexDirection: 'row', alignSelf: 'center' }}>
                                            <Text>{this.state.progress}%  </Text>
                                            {this.state.progress != 100 ? (
                                                <ActivityIndicator size='small' color='blue' />
                                            ) : (
                                                <Text>Processing</Text>
                                            )}
                                        </View>
                                    ) : (
                                        <View></View>
                                    )}
                                </KeyboardAwareScrollView>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    }
}

function UserAuth(props) {
    const navigation = useNavigation();
    const route = useRoute();
    return (
        <UserAuthScreen {...props} navigation={navigation} route={route} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginTitle: {
        borderBottomWidth: 1,
        paddingVertical: 5,
        marginBottom: 10,
        borderBottomColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    loginInput: {
        width: 250,
        marginVertical: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 3
    },
    loginButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center'
    },
    signupTitle: {
        borderBottomWidth: 1,
        paddingVertical: 5,
        marginBottom: 10,
        borderBottomColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    signupInput: {
        width: 250,
        marginVertical: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 3
    },
    signupButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center'
    },
    uploadingImage: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
        borderRadius: 50
    }
});

export default UserAuth;