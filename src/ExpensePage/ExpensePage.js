import React, {Component} from 'react';
import './ExpensePage.css';
import {database} from './../fire';
import exports from '../fire';

class ExpensePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      description: '',
      date: '',
      expenses: []
    }
  }

  componentDidMount = () => {
    database.ref('expenses/')
      .orderByChild('date')
      .on('child_added', data => {
        if (data.val().user === this.props.user.email) {
          this.addExpenseToState(data.key, data.val());
        }
      });
  }

  addExpenseToState(key, value) {
    this.setState({expenses: [{key, value}, ...this.state.expenses]});
  }

  onAddExpense = (event) => {
    event.preventDefault();

    database.ref('expenses/').push({
      amount: this.state.amount,
      date: this.state.date,
      description: this.state.description,
      user: this.props.user.email
    });

    this.setState({
      amount: '',
      description: '',
    });
  }

  addExpenseForm = () => {
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
        <input type="submit" value={"Add"}/>
        {$amountField}
        {$descriptionField}
        {$dateField}
      </form>
    );
  }

  expensesList = () => {
    const $expenseItems = this.state.expenses.map(({key, value}) => {
      return (<li key={key}>{value.date} (${value.amount}) {value.description}</li>);
    });

    return (
      <ul>
        {$expenseItems}
      </ul>
    );
  }

  render() {
    const {user} = this.props;
    return (
      <div>
        <h1>Win the Day</h1>
        <h2>Temperature</h2>
        Daily Allowance: $30
        <br />Today: $30
        <br />Impact: Even
        <br />Trending: +$7
        <h2>Expenses</h2>
        {this.addExpenseForm()}
        <h3>Today</h3>
        {this.expensesList()}
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
