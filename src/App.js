import React, { Component } from 'react';
import {useStore} from 'p-flux';

import exports from './fire';
import './App.css';
import store from './Store';
import ExpensePage from './ExpensePage/ExpensePage';
import SignInButton from './SignIn/SignInButton'

import ExpenseDispatchHandler from './ExpensePage/ExpenseDispatchHandler';

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
    ? (<ExpensePage user={user} {...this.props.store}/>)
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

export default useStore(App,
  {
    actions: [],
    dispatcherHandlers: [
      ExpenseDispatchHandler
    ],
    onDispatch: (event) => {
//      console.info('dispatching event', event);
    },
    store
  });
