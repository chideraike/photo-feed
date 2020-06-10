import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { f, auth, database, storage } from '../../config/firebaseConfig';
import { Icon } from 'react-native-eva-icons';

import PhotoList from '../components/photoList';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }

    checkParams = () => {
        //
        var params = this.props.route.params;
        if (params) {
            if (params.userId) {
                this.setState({
                    userId: params.userId
                });
                this.fetchUserInfo(params.userId);
            }
        }
    }

    fetchUserInfo = (userId) => {
        //
        var that = this;

        database.ref('users').child(userId).child('username').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();
            that.setState({ username: data });
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('name').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();
            that.setState({ name: data });
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('avatar').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();
            that.setState({ avatar: data, loaded: true });
        }).catch(error => console.log(error));
    }

    componentDidMount = () => {
        this.checkParams();

    }

    render() {
        const { navigation } = this.props;
        const { route } = this.props;
        return (
            <View style={styles.container}>
                {this.state.loaded == false ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Loading ...</Text>
                    </View>
                ) : (
                        <View style={{ flex: 1 }}>
                            <View style={styles.title}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Icon name='chevron-up-outline' height={30} width={30} fill="#000000" />
                                </TouchableOpacity>
                                <View>
                                    <Text style={styles.titleText}>{this.state.username}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Icon name='more-vertical-outline' height={30} width={30} fill="#000000" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.nameContainer}>
                                <Image source={{ uri: this.state.avatar }} style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50 }} />
                                <View style={{ marginRight: 10 }}>
                                    <Text>{this.state.name}</Text>
                                </View>
                            </View>
                            <View style={styles.buttonContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.button}>
                                        <Text style={styles.buttonText}>Follow</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button}>
                                        <Text style={styles.buttonText}>Message</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button}>
                                        <Text style={styles.buttonText}>Tip</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation} />
                        </View>
                    )}
            </View>
        );
    }
}

function UserProfileScreen(props) {
    const navigation = useNavigation();
    const route = useRoute();
    return (
        <UserProfile {...props} navigation={navigation} route={route} />
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
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 20
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
    },
    photoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff0f0'
    }
});

export default UserProfileScreen;