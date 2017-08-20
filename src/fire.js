import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyB9jEcYJHfaVofvU5XGWudQIPe653UjN1o",
  authDomain: "budget-b47cf.firebaseapp.com",
  databaseURL: "https://budget-b47cf.firebaseio.com",
  projectId: "budget-b47cf",
  storageBucket: "budget-b47cf.appspot.com",
  messagingSenderId: "247175653155"
};
var fire = firebase.initializeApp(config);
export default fire;