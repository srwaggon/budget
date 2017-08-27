import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyB9jEcYJHfaVofvU5XGWudQIPe653UjN1o",
  authDomain: "budget-b47cf.firebaseapp.com",
  databaseURL: "https://budget-b47cf.firebaseio.com",
  projectId: "budget-b47cf",
  storageBucket: "budget-b47cf.appspot.com",
  messagingSenderId: "247175653155"
};

const fire = firebase.initializeApp(config);

export const auth = fire.auth();

export const database = fire.database();

const googleProvider = new firebase.auth.GoogleAuthProvider();

const exports = {
  fire,
  googleProvider
};

export default exports;
