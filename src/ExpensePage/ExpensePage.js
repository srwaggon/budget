import React, {Component} from 'react';
import { encode } from 'base32';

import './ExpensePage.css';
import {database} from './../fire';
import exports from '../fire';

class ExpensePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allowance: 0,
      amount: '',
      description: '',
      date: '',
      expenses: [],
      oldestExpenseDate: Number.MAX_VALUE,
      newestExpenseDate: 0
    }
  }

  componentDidMount = () => {
    this.subscribeToExpenseAdditions();
    this.loadAllowance();
  }

  subscribeToExpenseAdditions = () => {
    const userKey = this.getUserKey();
    database.ref('expenses/')
      .orderByChild('date')
      .on('child_added', data => {
        const expense = data.val();
        if (expense.user === userKey) {
          this.addExpenseToState(data.key, expense);
        }

        const expenseDate = Date.parse(expense.date) / 24 / 60 / 60 / 1000;

        if (expenseDate < this.state.oldestExpenseDate) {
          this.setState({oldestExpenseDate: expenseDate});
        }

        if (expenseDate > this.state.newestExpenseDate) {
          this.setState({newestExpenseDate: expenseDate});
        }
      });
  }

  loadAllowance = () => {
    const userKey = this.getUserKey();
    database.ref('users/' + userKey + '/allowance')
      .on('value', snapshot => {
        this.setState({allowance: snapshot.val()});
      });
  }

  onUpdateAllowance = (event) => {
    this.updateAllowance(parseFloat(event.target.value || 0));
  }

  updateAllowance = (amount) => {
    const userKey = this.getUserKey();
    database.ref('users/' + userKey)
      .update({allowance: amount});
  }

  getUserKey = () => {
    return encode(this.props.user.email);
  }

  addExpenseToState(key, value) {
    this.setState({expenses: [{key, value}, ...this.state.expenses]});
  }

  addExpense = () => {
    const userKey = this.getUserKey();

    const expenseRef = database.ref('expenses/')
      .push({
        amount: this.state.amount,
        date: this.state.date,
        description: this.state.description,
        user: userKey
      });

    database.ref(`users/${userKey}/expenses`)
      .update({[expenseRef.key]: true});
  }

  onAddExpense = (event) => {
    event.preventDefault();

    this.addExpense();

    this.setState({
      amount: '',
      description: '',
    });
  }

  getAddExpenseForm = () => {
    const $amountField = (
      <input
        type="number"
        placeholder={"amount"}
        min="0.01"
        step="0.01"
        value={this.state.amount}
        onChange={event =>
          this.setState({amount: event.target.value})
        }
      />
    );

    const $descriptionField = (
      <input
        type="text"
        placeholder={"description"}
        value={this.state.description}
        onChange={event =>
          this.setState({description: event.target.value})
        }
      />
    );

    const $dateField = (
      <input
        type="date"
        placeholder={"when"}
        value={this.state.date}
        onChange={event => this.setState({date: event.target.value})}
      />
    );

    return (
      <form onSubmit={this.onAddExpense}>
        {$amountField}
        {$descriptionField}
        {$dateField}
        <input type="submit" value={"Add"}/>
      </form>
    );
  }

  getExpensesList = () => {
    const $expenseItems = this.state.expenses.map(({key, value}) => {
      return (<li key={key}>{value.date} (${value.amount}) {value.description}</li>);
    });

    return (
      <ul>
        {$expenseItems}
      </ul>
    );
  }

  getDateSpan = () => {
    return this.state.newestExpenseDate - this.state.oldestExpenseDate;
  }

  getTotalSum = () => {
    return this.state.expenses.reduce((sum, {key, value}) => {
      return sum + parseFloat(value.amount);
    }, 0);
  }

  getLifelongHealth = () => {
    return this.getDateSpan() * this.state.allowance - this.getTotalSum();
  }

  render() {
    const {user} = this.props;
    return (
      <div>
        <h1>Win the Day</h1>
        <h2>Temperature</h2>
        <label>
          Allowance:
          <input type="number" min="0" step=".01" value={this.state.allowance} onChange={this.onUpdateAllowance} />
        </label>
        <br />Total days: {this.getDateSpan()}
        <br />Total spent: ${this.getTotalSum()}
        <br />Lifelong Health: ${this.getLifelongHealth()}
        <br />Trending: +$7
        <h2>Expenses</h2>
        {this.getAddExpenseForm()}
        <h3>Today</h3>
        <br />Total: $30
        <br />Impact: Even
        {this.getExpensesList()}
        <button onClick={this.signOut}>Sign Out</button>
      </div>
    );
  }

  signOut = () => {
    const {fire, googleProvider} = exports;
    fire.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }
}

export default ExpensePage;
