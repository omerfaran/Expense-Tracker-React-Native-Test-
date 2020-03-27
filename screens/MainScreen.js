import React, { useState, useEffect, useCallback, useReducer } from 'react'

import { StyleSheet, ScrollView, View, KeyboardAvoidingView, TextInput, Button, ActivityIndicator, Alert, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import * as expensesActions from '../store/actions/expenses'

import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../components/UI/HeaderButton'

import Colors from '../constants/Colors'
import Input from '../components/UI/Input'

// MAIN SCREEN (SCREEN 1)

const formReducer = (state, action) => {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (let key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  return state;
};

const MainScreen = props => {
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [averageAmount, setAverageAmount] = useState(null)

    const dispatch = useDispatch()

    const [formState, dispatchFormState] = useReducer(formReducer, {
      inputValues: {
        title: '',
        amount: ''
      },
      inputValidities: {
        title: false,
        amount: false
      },
      formIsValid: false
    });
    
    const fetchedList = useSelector(state => state.expense.expenseList);

    // Calculate average any time the list changes
    useEffect(() => {
      calculateAverageExpense()
    }, [fetchedList])

    // Get expense list
    useEffect(() => {
      const loadList = async () => {
        setIsLoading(true)
        await dispatch(expensesActions.getExpenseList())
      }
      loadList()
      }, [dispatch]);

    useEffect(() => {
        if (error) {
          Alert.alert('There was an error', error, [{ text: 'OK' }]);
        }
      }, [error]);

    const calculateAverageExpense = () => {
      let sum = 0
      for (const key in fetchedList) {
        sum = sum + Number(fetchedList[key].amount)
      }
      setAverageAmount(Math.floor(sum / fetchedList.length))
      setIsLoading(false)
    }

    const submitExpenseHandler = async () => { // Dispatch action to save new expense
        setIsLoading(true)
        setError(null)
        
        try {
            // Add new expense
            await dispatch(
                expensesActions.addExpense(
                formState.inputValues.title,
                formState.inputValues.amount
                )
            )
            // success  
            setIsLoading(false)
            Alert.alert('Success', 'Expense added successfully!', [{ text: 'OK' }]);
        } catch (err) {
            setIsLoading(false)
            setError(err.message)
        }
      }

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
          dispatchFormState({
            type: 'FORM_INPUT_UPDATE',
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
          });
        },
        [dispatchFormState]
      )

    return (
        <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        styles={styles.container}
        >
            <View style={styles.innerFields}>
              <ScrollView>
                  <Input
                      id="title"
                      label="Title"
                      keyboardType="default"
                      required
                      autoCapitalize="none"
                      onInputChange={inputChangeHandler}
                      initialValue=""/>
                  <Input
                      id="amount"
                      label="Expense Amount"
                      keyboardType="number-pad"
                      required
                      autoCapitalize="none"
                      onInputChange={inputChangeHandler}
                      initialValue=""/>

                  {isLoading ? <ActivityIndicator size="small"  color={Colors.primary}/> : 
                  <Button title="Add New Expense"
                      color={Colors.primary} 
                      onPress={submitExpenseHandler} 
                      disabled={!formState.formIsValid}/>}
              </ScrollView>
            </View>
            <View>
              {!isLoading && (
                <View style={styles.centeredText}>
                  <Text>
                    Average Expense: {averageAmount}
                  </Text>
                </View>
              )}
            </View>

        </KeyboardAvoidingView>
    )
}

MainScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Main Screen',
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
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerFields: {
      maxWidth: 400,
      padding: 20,
    },
    centeredText: {
      alignItems: 'center',
    }
  });

export default MainScreen