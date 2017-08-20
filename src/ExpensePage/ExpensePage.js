import React, {Component} from 'react';
import style from './ExpensePage.css';

class ExpensePage extends Component {
  constructor(props) {
    super(props);

    this.state = this.getDefaultState();
  }

  getDefaultState = () => {
    return {
      expenseAmount: '',
      expenseDescription: '',
    }
  }

  onAddExpense = (event) => {
    event.preventDefault();
    this.setState(this.getDefaultState());
  }

  addExpenseForm = () => {
    const $amountField = (
      <input
        type="number"
        placeholder={"amount"}
        min="0.01"
        step="0.01"
        value={this.state.expenseAmount}
        onChange={event =>
          this.setState({expenseAmount: event.target.value})
        }
      />
    );
    return (
      <form onSubmit={this.onAddExpense}>
        <input type="submit" value={"Add"}/>
        {$amountField}
        <input type="text" placeholder={"expense"} />
        <input type="date" placeholder={"when"} />
      </form>
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
        <ul>
          <li>(20s) Groceries</li>
        </ul>
        <h3>Yesterday</h3>
        <ul>
          <li>(1g) Carbide 400C</li>
        </ul>
        <h3>Wednesday, Aug 13</h3>
        <ul>
          <li>(1g) Carbide 400C</li>
        </ul>
      </div>
    );
  }
}

export default ExpensePage;