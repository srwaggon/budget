import React, {Component} from 'react';
import { encode } from 'base32';

import {Actions} from 'p-flux';

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
          Actions.addExpense({key: data.key, value: expense});
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
        {$dateField}
        {$amountField}
        {$descriptionField}
        <input type="submit" value={"Add"}/>
      </form>
    );
  }

  getExpensesList = () => {
    const $expenseItems = this.props.expenses.map(({key, value}) => {
      return (
        <tr key={key}>
          <td>{value.date}</td>
          <td>${value.amount}</td>
          <td>{value.description}</td>
        </tr>);
    });

    return (
      <table className="expensesTable">
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Description</th>
        </tr>
        {$expenseItems}
      </table>
    );
  }

  getDateSpan = () => {
    const today = Date.now() / 24 / 60 / 60 / 1000;
    return today - this.props.oldestExpenseDate;
  }

  getSpendingSum = (expenseList) => {
    return expenseList.reduce((sum, {key, value}) => {
      return sum + parseFloat(value.amount);
     }, 0);
  }

  getSumForDateSpan = (dateSpan) => {
    const expenses = this.getExpensesForDateSpan(dateSpan);
    return this.getSpendingSum(expenses);
  }

  getExpensesForDateSpan = (dateSpan) => {
    const now = new Date();
    const then = new Date().setDate(now.getDate() - dateSpan)
    return this.props.expenses.filter(({key, value}) => {
      return new Date(value.date) >= then;
    });
  }

  getAllowance = (dateSpan) => {
    return dateSpan * this.state.allowance;
  }

  getRemainingAllowance = (dateSpan) => {
    return this.getAllowance(dateSpan) - this.getSumForDateSpan(dateSpan);
  }

  getTrendForDateSpan = (dateSpan) => {
    return this.getRemainingAllowance(dateSpan) / dateSpan;
  }

  render() {
    const {user} = this.props;

    const dayLong = 1;
    const dayLongAllowance = this.getAllowance(dayLong);
    debugger;
    const dayLongSpent = this.getSumForDateSpan(dayLong);
    const remainingDayLongAllowance = Math.round(this.getRemainingAllowance(dayLong) * 100) / 100;
    const dayLongTrend = Math.round(this.getTrendForDateSpan(dayLong) * 100) / 100;

    const weekLong = 7;
    const weekLongAllowance = this.getAllowance(weekLong);
    const weekLongSpent = this.getSumForDateSpan(weekLong);
    const remainingWeekLongAllowance = Math.round(this.getRemainingAllowance(weekLong) * 100) / 100;
    const weekLongTrend = Math.round(this.getTrendForDateSpan(weekLong) * 100) / 100;

    const lifetime = this.getDateSpan();
    const lifetimeAllowance = this.getAllowance(Math.floor(lifetime));
    const lifetimeSpent = this.getSumForDateSpan(lifetime);
    const remaininglifetimeAllowance = Math.round(this.getRemainingAllowance(lifetime) * 100) / 100;
    const lifetimeTrend = Math.round(this.getTrendForDateSpan(lifetime) * 100) / 100;

    return (
      <div>
        <h1>Win the Day</h1>
        <label>
          Daily Allowance:
          <input type="number" min="0" step=".01" value={this.state.allowance} onChange={this.onUpdateAllowance} />
        </label>

        <h2>Temperature</h2>
        <table className="temperatureTable">
          <tr>
            <th>Period</th>
            <td>Today</td>
            <td>This Week</td>
            <td>Lifetime ({Math.floor(lifetime)} days)</td>
          </tr>

          <tr>
            <th>Allowance</th>
            <td>${dayLongAllowance}</td>
            <td>${weekLongAllowance}</td>
            <td>${lifetimeAllowance}</td>
          </tr>

          <tr>
            <th>Spent</th>
            <td>${dayLongSpent}</td>
            <td>${weekLongSpent}</td>
            <td>${lifetimeSpent}</td>
          </tr>

          <tr>
            <th>Health</th>
            <td>${remainingDayLongAllowance}</td>
            <td>${remainingWeekLongAllowance}</td>
            <td>${remaininglifetimeAllowance}</td>
          </tr>

          <tr>
            <th>Trend</th>
            <td>${dayLongTrend}</td>
            <td>${weekLongTrend}</td>
            <td>${lifetimeTrend}</td>
          </tr>
        </table>

        <h2>Expenses</h2>
        {this.getAddExpenseForm()}
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
