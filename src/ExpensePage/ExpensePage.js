import React, {Component} from 'react';
import style from './ExpensePage.css';
import {database} from './../fire';

class ExpensePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expenses: [],
      amount: '',
      description: '',
    }
  }

  getDefaultState = () => {
    return
  }

  componentDidMount = () => {
    database.ref('/expenses')
    .orderByChild('description')
    .on('value', snapshot => {
      snapshot.forEach(childSnapshot => {
        const expense = {
          key: childSnapshot.key,
          value: childSnapshot.val()
        };
        const {expenses} = this.state;
        this.setState({expenses: [...expenses, expense]});
      });
    });
  }

  onAddExpense = (event) => {
    event.preventDefault();

    database.ref('/expenses/').push({
      amount: this.state.amount,
      description: this.state.description
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

    return (
      <form onSubmit={this.onAddExpense}>
        <input type="submit" value={"Add"}/>
        {$amountField}
        {$descriptionField}
        <input type="date" placeholder={"when"} />
      </form>
    );
  }

  expensesList = () => {
    const $expenseItems = this.state.expenses.map(({key, value}) => {
        return (<li key={key}>(${value.amount}) {value.description}</li>);
    });

    return (
      <ul>
        {$expenseItems}
      </ul>
    );
  }

  render() {
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
      </div>
    );
  }
}

export default ExpensePage;