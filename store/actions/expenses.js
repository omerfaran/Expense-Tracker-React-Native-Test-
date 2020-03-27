import Expense from '../../models/expense'

export const ADD_EXPENSE = "ADD_EXPENSE"
export const GET_EXPENSE_LIST = "GET_EXPENSE_LIST"
export const DELETE_EXPENSE = "DELETE_EXPENSE"
export const UPDATE_LIST = "UPDATE_LIST"
export const DELETE_LIST = "DELETE_LIST"

export const addExpense = (title, amount) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        const date = getFormattedDate()

        const response = await fetch(`https://rn-test-688fb.firebaseio.com//${userId}.json?auth=${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            amount,
            date
        })
        });

        const resData = await response.json()

        if (!response.ok) {
            throw new Error(`Error: Could not add expense (${response.status})`)
        }

        dispatch({type: ADD_EXPENSE, newExpense: new Expense(
            resData.name,
            title, 
            amount, 
            date) })
    }
  }

export const getExpenseList = () => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        const response = await fetch(`https://rn-test-688fb.firebaseio.com//${userId}.json?auth=${token}`)

        const resData = await response.json()
        const expenseList = []

        for (const key in resData) {
            expenseList.push(new Expense(
                key, 
                resData[key].title, 
                resData[key].amount, 
                resData[key].date))
        }

        if (!response.ok) {
            throw new Error(`Error: Could not get list (${response.status})`)
        }
        
        dispatch({ type: GET_EXPENSE_LIST, expenseList})
    }
}

export const deleteExpense = (key, index) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        const response = await fetch(`https://rn-test-688fb.firebaseio.com//${userId}/${key}.json?auth=${token}`,
            {method: "DELETE"})

        const resData = await response.json()

        if (!response.ok) {
            throw new Error(`Error: Could not delete expense (${response.status})`)
        }
        
        // Remove item from array and dispatch udpated list
        const newList = getState().expense.expenseList
        newList.splice(index, 1)
        // dispatch({ type: GET_EXPENSE_LIST, expenseList: newList})

        dispatch({type: UPDATE_LIST, newList})
    }
}

export const deleteList = () => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId

        const response = await fetch(`https://rn-test-688fb.firebaseio.com//${userId}.json?auth=${token}`,
            {method: "DELETE"})

        const resData = await response.json()

        if (!response.ok) {
            throw new Error(`Error: Could not delete list (${response.status})`)
        }

        dispatch({type: DELETE_LIST})
    }
}

  const getFormattedDate = () => {
    let current_datetime = new Date()
    return current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
  }

