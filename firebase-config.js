const firebaseConfig = {
    // Replace with your actual config from Firebase Console
    apiKey: "xxx",
    authDomain: "blacklist-xxxxx.firebaseapp.com",
    projectId: "blacklist-xxxxx",
    storageBucket: "blacklist-xxxxx.appspot.com",
    messagingSenderId: "xxxxxxxxxx",
    appId: "1:xxxxxxxxxx:web:xxxxxxxxxxxxxxxx"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();