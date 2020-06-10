import React from 'react';
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-eva-icons';
import { f, auth, database, storage } from './config/firebaseConfig';

import FeedScreen from './app/screens/FeedScreen';
import DiscoverScreen from './app/screens/DiscoverScreen';
import ActivityScreen from './app/screens/ActivityScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import UploadScreen from './app/screens/UploadScreen';
import UserProfileScreen from './app/screens/UserProfileScreen';
import CommentScreen from './app/screens/CommentScreen';

const Feed = createStackNavigator();

function FeedStack() {
  return (
    <Feed.Navigator initialRouteName="Home" mode="modal" headerMode="none">
      <Feed.Screen name="Home" component={FeedScreen} />
      <Feed.Screen name="User" component={UserProfileScreen} />
      <Feed.Screen name="Comments" component={CommentScreen} />
    </Feed.Navigator>
  );
}

const Discover = createStackNavigator();

function DiscoverStack() {
  return (
    <Discover.Navigator initialRouteName="Home" mode="modal" headerMode="none">
      <Discover.Screen name="Home" component={DiscoverScreen} />
      <Discover.Screen name="User" component={UserProfileScreen} />
      <Discover.Screen name="Comments" component={CommentScreen} />
    </Discover.Navigator>
  );
}

const Upload = createStackNavigator();

function UploadStack() {
  return (
    <Upload.Navigator screenOptions={{ animationEnabled: false }} initialRouteName="Add" mode="modal" headerMode="none">
      <Upload.Screen name="Add" component={UploadScreen} options={{ animationEnabled: true }} />
    </Upload.Navigator>
  );
}

const Activity = createStackNavigator();

function ActivityStack() {
  return (
    <Activity.Navigator initialRouteName="Home" mode="modal" headerMode="none">
      <Activity.Screen name="Home" component={ActivityScreen} />
      <Activity.Screen name="User" component={UserProfileScreen} />
      <Activity.Screen name="Comments" component={CommentScreen} />
    </Activity.Navigator>
  );
}

const Profile = createStackNavigator();

function ProfileStack() {
  return (
    <Profile.Navigator initialRouteName="Home" mode="modal" headerMode="none">
      <Profile.Screen name="Home" component={ProfileScreen} />
      <Profile.Screen name="Add" component={UploadScreen} />
      <Profile.Screen name="User" component={UserProfileScreen} />
      <Profile.Screen name="Comments" component={CommentScreen} />
    </Profile.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  login = async () => {
    //Force user to login
    try {
      let user = await auth.signInWithEmailAndPassword('test@user.com', 'password')
    } catch (error) {
      console.log(error);
    }
  }

  constructor(props) {
    super(props);
    this.login();
  }

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Feed" tabBarOptions={{ showLabel: false, tabStyle: { backgroundColor: '#fafafa' } }}>
          <Tab.Screen name="Feed" component={FeedStack} options={{
            tabBarIcon: () => (
              <Icon name='home-outline' height={35} width={35} fill="#000000" />
            )
          }} />
          <Tab.Screen name="Discover" component={DiscoverStack} options={{
            tabBarIcon: () => (
              <Icon name='search-outline' height={35} width={35} fill="#000000" />
            )
          }} />
          <Tab.Screen name="Add" component={UploadStack} options={{
            tabBarIcon: () => (
              <Icon name='plus-square-outline' height={35} width={35} fill="#000000" />
            )
          }} listeners={({ navigation }) => ({
            // tabPress: event => {
            //   event.preventDefault();
            //   navigation.navigate("Upload");
            // }
          })} />
          <Tab.Screen name="Activity" component={ActivityStack} options={{
            tabBarIcon: () => (
              <Icon name='heart-outline' height={35} width={35} fill="#000000" />
            )
          }} />
          <Tab.Screen name="Profile" component={ProfileStack} options={{
            tabBarIcon: () => (
              <Icon name='person-outline' height={35} width={35} fill="#000000" />
            )
          }} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}