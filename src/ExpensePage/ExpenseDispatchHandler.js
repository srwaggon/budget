import {Dispatcher} from 'p-flux';

const ExpenseDispatchHandler = {
  addExpense({data}) {
    this.$store.refine('expenses').unshift(data);

    const expenseDate = Date.parse(data.value.date) / 24 / 60/ 60/ 1000;
    Dispatcher.dispatch({type: 'updateOldestExpenseDate', data: expenseDate});
  },

  updateOldestExpenseDate({data: expenseDate}) {
    const oldValue = this.$store.refine('oldestExpenseDate').get();
    if (expenseDate < oldValue) {
      this.$store.refine('oldestExpenseDate').set(expenseDate);
      this.$store.flush()
    }
  },
};

export default ExpenseDispatchHandler;