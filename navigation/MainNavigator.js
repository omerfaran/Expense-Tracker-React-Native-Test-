import React from 'react'

import { Platform, SafeAreaView, Button, View } from 'react-native'

import { createAppContainer, createSwitchNavigator, DrawerItems } from 'react-navigation'
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack'

import { useDispatch } from 'react-redux'

import AuthScreen from '../screens/AuthScreen'

import Colors from '../constants/Colors';

import MainScreen from '../screens/MainScreen'
import ExpenseListScreen from '../screens/ExpenseListScreen'
import StartupScreen from '../screens/StartupScreen'

import * as authActions from '../store/actions/auth'

const defaultNavOptions = { // TODO: find out what it is
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const MainNavigator = createStackNavigator(
  {
    Main: MainScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    navigationOptions: {title: "Main Screen"}
  }
)

const ExpenseListNavigator = createStackNavigator(
  {
    ExpenseList: ExpenseListScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    navigationOptions: {title: "Expense List"}
  }
)

const AppNavigator = createDrawerNavigator(
  {
    Main: MainNavigator,
    ExpenseList: ExpenseListNavigator
  },
  {
    contentComponent: props => {
      const dispatch = useDispatch()
      return (
        <View style={{flex: 1, marginTop: 28}}>
          <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerNavigatorItems {...props}/>
            <Button title="Logout" color={Colors.primary} onPress={() => { 
                  dispatch(authActions.logout())
                  props.navigation.navigate('Auth')
                }
              }/>
          </SafeAreaView>
        </View>
      )
    }
  }
)

const AuthNavigator = createStackNavigator(
    {
      Auth: AuthScreen
    },
    {
      defaultNavigationOptions: defaultNavOptions,
    },
  )

  const MainNavigatorSettings = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    App: AppNavigator,
    // Shop: ShopNavigator main stack after logging in
  })
  
  export default createAppContainer(MainNavigatorSettings);