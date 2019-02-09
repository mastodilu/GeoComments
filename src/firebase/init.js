import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAdcKpj2WMtBaBYx7Yo5NggG2-M2nQFQvE",
    authDomain: "geo-comment.firebaseapp.com",
    databaseURL: "https://geo-comment.firebaseio.com",
    projectId: "geo-comment",
    storageBucket: "",
    messagingSenderId: "283221427055"
};
const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({ timestampsInSnapshots: true }) //initialize firestore on firebaseApp

export default firebaseApp.firestore()