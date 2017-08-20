import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ExpensePage from './ExpensePage/ExpensePage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ExpensePage />
      </div>
    );
  }
}

export default App;
