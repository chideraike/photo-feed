import firebase from 'firebase';

const firebaseConfig = {
    // Your Firebase Config Details
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
