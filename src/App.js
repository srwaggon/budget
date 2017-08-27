import React, { Component } from 'react';
import exports from './fire';

import './App.css';
import ExpensePage from './ExpensePage/ExpensePage';
import SignInButton from './SignIn/SignInButton'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ''
    };
  }

  componentDidMount() {
    this.addSignInListener();
  }

  render() {
    const {user} = this.state;

    const pageToDisplay = user
    ? (<ExpensePage user={user} />)
    : (<SignInButton />);

    return (
      <div className="App">
        {pageToDisplay}
      </div>
    );
  }

  addSignInListener = () => {
    const {fire} = exports;

    fire.auth().onAuthStateChanged(this.saveUserForLater);
  }

  saveUserForLater = (user) => {
    this.setState({user: user || ''});
  }
}

export default App;
