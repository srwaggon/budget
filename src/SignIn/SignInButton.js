import React, {Component} from 'react'
import exports from '../fire';

class SignIn extends Component {

  render() {
    return (<button onClick={this.signIn}>Sign in</button>)
  }
  
  signIn = () => {
    const {fire, googleProvider} = exports;
    fire.auth().signInWithPopup(googleProvider).then(function(result) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // ...
      }
      const user = result.user;
      console.log(user);
    }).catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
      console.log(error);
    });
  }
}

export default SignIn;
