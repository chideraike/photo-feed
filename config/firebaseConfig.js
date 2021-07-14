import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyApv8isjLMDb3Gl9u9VgrOB6L8RN4HanNw",
    authDomain: "photo-feed-62a0b.firebaseapp.com",
    databaseURL: "https://photo-feed-62a0b.firebaseio.com",
    projectId: "photo-feed-62a0b",
    storageBucket: "photo-feed-62a0b.appspot.com",
    messagingSenderId: "998250116264",
    appId: "1:998250116264:web:c07f7af82bb1677ae3be9d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
