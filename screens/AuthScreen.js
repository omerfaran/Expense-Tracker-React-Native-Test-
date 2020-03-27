import React, { useState, useEffect, useCallback, useReducer } from 'react'

import { StyleSheet, ScrollView, View, KeyboardAvoidingView, TextInput, Button, ActivityIndicator, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import * as authActions from '../store/actions/auth'

import Input from '../components/UI/Input'
import Colors from '../constants/Colors'

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

const AuthScreen = (props) => {
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)

  const dispatch = useDispatch()

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: ''
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('There was an error.', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const loginSignupHandler = async () => { // Dispatch action with Redux to login/signup user
    setIsLoading(true)
    setError(null)
    
    try {
      if (isSignup) {
        await dispatch(
          authActions.signup(
            formState.inputValues.email,
            formState.inputValues.password
          )
        )
      } else {
        // Login user
        await dispatch(
          authActions.login(
            formState.inputValues.email,
            formState.inputValues.password
          )
        )
      }
      props.navigation.navigate('App')
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
      style={styles.container}
      >
      <View style={styles.innerFields}>
        <ScrollView >

            <Input
                id="email"
                label="E-Mail"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Email is not valid"
                onInputChange={inputChangeHandler}
                initialValue=""/>
            <Input
                id="password"
                label="Password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={6}
                autoCapitalize="none"
                errorText="Password is not valid"
                onInputChange={inputChangeHandler}
                initialValue=""/>
            {isLoading ? <ActivityIndicator size="small"/> : 
            <Button title={isSignup ? 'Sign Up' : 'Login'} 
              color={Colors.primary} 
              onPress={loginSignupHandler} 
              disabled={!formState.formIsValid}/>}
            <Button title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`} color={Colors.primary} onPress={() =>
              setIsSignup(prevState => !prevState)
            }/>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    )
}

AuthScreen.navigationOptions = {
  headerTitle: 'Welcome To Test'
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerFields: {

      maxWidth: 400,
      width: '70%',
      height: '50%',
      maxHeight: 400,
      padding: 20,
    }
  });

export default AuthScreen