import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { f, auth, database, storage } from '../../config/firebaseConfig';
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
            moveScreen: false
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

    createUserObj = (userObj, name, username, email) => {
        console.log(userObj, email, userObj.uid);

        var uObj = {
            name: name,
            username: username,
            avatar: 'http://www.gravatar.com/avatar',
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

            } catch (error) {
                console.log(error);
                alert(error);
            }
        } else {
            alert('Some fields are empty');
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
                                        <Text style={{ color: 'white' }}>Login</Text>
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
                                            <View></View>
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
                                            <TouchableOpacity onPress={() => this.signup()} style={styles.signupButton}>
                                                <Text style={{ color: 'white' }}>Sign Up</Text>
                                            </TouchableOpacity>
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
    }
});

export default UserAuth;