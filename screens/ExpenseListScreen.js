import React, { useState, useEffect, useReducer, useCallback } from 'react'

import { StyleSheet, ScrollView, View, KeyboardAvoidingView, TouchableOpacity, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native'
import Input from '../components/UI/Input'
import { useDispatch, useSelector } from 'react-redux'

import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../components/UI/HeaderButton'

import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

import * as expensesActions from '../store/actions/expenses'

import Colors from '../constants/Colors'

// EXPENSE LIST SCREEN (SCREEN 2)

const tableHead = ["Title", "Amount", "Date", ""]
const tableData = [
    ['1', '2', '3',],
    ['a', 'b', 'c', ],
    ['1', '2', '3',],
    ['a', 'b', 'c', ]
  ] // Example of pattern

  const formReducer = (state, action) => {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    return {
      inputValues: updatedValues
    };
  return state;
};

const ExpenseListScreen = (props) => {
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [expenseList, setExpenseList] = useState([])
    const [unfilteredTableData, setUnfilteredTableData] = useState([])
    const [tableData, setTableData] = useState([])

    const dispatch = useDispatch()

    const fetchedList = useSelector(state => state.expense.expenseList);

    useEffect(() => {
        if (fetchedList && fetchedList.length > 0 && fetchedList[0].key == "empty") {
            setIsLoading(true)
        } else {
            setExpenseList(fetchedList)

            const tableArray = []
            for (const key in fetchedList) {
                tableArray.push([
                    fetchedList[key].title, 
                    fetchedList[key].amount, 
                    fetchedList[key].date,
                    fetchedList[key].key])
            }

            setUnfilteredTableData(tableArray)
            setIsLoading(false)
            setTableData(tableArray)            
        }
    }, [fetchedList])

    useEffect(() => {
        FilterListHandler()
    }, [unfilteredTableData])

    if (isLoading) {
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        );
      }

    const FilterListHandler = () => {
        // Remove filters and show original list
        if (formState.inputValues.minValue == "" && formState.inputValues.maxValue == "") {
            setTableData(unfilteredTableData)
            return
        }

        let filteredTable = [...unfilteredTableData]
        for (let key = unfilteredTableData.length - 1; key >= 0; key--) { // Looping backwards because we might remove items
            if ((formState.inputValues.minValue !== "" && Number(unfilteredTableData[key][1]) < Number(formState.inputValues.minValue)) 
                ||(formState.inputValues.maxValue !== "" && Number(unfilteredTableData[key][1]) > Number(formState.inputValues.maxValue))) {
                    // Column amount is outside of range so it should be removed
                    filteredTable.splice(key, 1)
                }
        }
        setTableData(filteredTable)
    }

    // DELETE SELECTED ITEM
    const deleteHandler = index => {
    Alert.alert(
        'Delete Expense',
        'Are you sure you want to delete this expense?',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => {
              // Get real index (table could be filtered)
              const realIndex = fetchedList.findIndex(item => item.key == tableData[index][3])
              // Delete expense
              dispatch(expensesActions.deleteExpense(fetchedList[realIndex].key, realIndex))
          }},
        ],
      )
    }

    // DELETE COMPLETE LIST
    const deleteListHandler = index => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete the complete list?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => {
                  // Delete expense
                  dispatch(expensesActions.deleteList())
              }},
            ],
          )
        }

    const element = (data, index) => (
        <TouchableOpacity onPress={() => deleteHandler(index)}>
        <View style={styles.btn}>
            <Text style={styles.btnText}>Delete</Text>
        </View>
        </TouchableOpacity>
    )

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          minValue: '',
          maxValue: ''
        }
      })
    
    const filterInputHandler = useCallback(
        (inputIdentifier, inputValue) => {
          dispatchFormState({
            type: 'FORM_INPUT_UPDATE',
            value: inputValue,
            input: inputIdentifier
          })
        },
        [dispatchFormState]
      )

    return (
        <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        styles={styles.container}
        >
            <ScrollView style={styles.tableStyle}>
                <Table  borderStyle={{borderColor: 'transparent'}}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                {
                    tableData.map((rowData, index) => (
                    <TableWrapper key={index} style={styles.row}>
                        {
                        rowData.map((cellData, cellIndex) => (
                            <Cell key={cellIndex} data={cellIndex === 3 ? element(cellData, index) : cellData} textStyle={styles.text}/>
                        ))
                        }
                    </TableWrapper>
                    ))
                }
                </Table>
            </ScrollView>
            <Input
                id="minValue"
                label="Min Amount"
                keyboardType="number-pad"
                autoCapitalize="none"
                onInputChange={filterInputHandler}
                initialValue=""/>
            <Input
                id="maxValue"
                label="Max Amount"
                keyboardType="number-pad"
                autoCapitalize="none"
                onInputChange={filterInputHandler}
                initialValue=""/>   
            <Button title="Filter List"
                color={Colors.primary} 
                onPress={FilterListHandler} 
                disabled={!tableData && tableData.length == 0}/>
            <Button title="Delete List"
                color={Colors.primary} 
                onPress={deleteListHandler} 
                disabled={!tableData && tableData.length == 0}/>
        </KeyboardAvoidingView>
    )
}

ExpenseListScreen.navigationOptions = navData => {
    return {
      headerTitle:'Expense List Screen',
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Menu"
            iconName="ios-menu"
            onPress={() => {
              navData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      )
    };
  };

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    tableStyle: {
        maxHeight: '60%'
    },
    head: { height: 40, backgroundColor: '#808B97' },
    text: { margin: 6 },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
    btn: { width: 58, height: 24, padding: 2, backgroundColor: '#78B7BB',  borderRadius: 2 },
    btnText: { textAlign: 'center', color: '#fff' }
  });


export default ExpenseListScreen