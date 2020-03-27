import { ADD_EXPENSE, GET_EXPENSE_LIST, UPDATE_LIST, DELETE_LIST } from "../actions/expenses"

const initialState = {
    expenseList: [{key: "empty"}] // inital value so ExpenseListScreen knows list wasn't fetched yet
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_EXPENSE_LIST:
            return {
                expenseList: action.expenseList
            }
        case ADD_EXPENSE:
            return {
                expenseList: [...state.expenseList, action.newExpense]
            }
        case UPDATE_LIST:
            return {
                expenseList: [...action.newList]
            }
        case DELETE_LIST:
            return {
                expenseList: []
            }
        default:
            return state
    }
}