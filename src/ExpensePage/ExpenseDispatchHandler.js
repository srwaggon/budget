const ExpenseDispatchHandler = {
  addExpense({data}) {
    this.$store.refine('expenses').unshift(data);
  }
};

export default ExpenseDispatchHandler;