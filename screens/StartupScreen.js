import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native'
import { useDispatch } from 'react-redux'

import Colors from '../constants/Colors'
import * as authActions from '../store/actions/auth'

// FIRST SCREEN FOR DIRECTING USER TO AUTHENTICATION OR MAIN SCREEN

const StartupScreen = props => {
    const dispatch = useDispatch()

    useEffect(() => {
        const tryLogin = async () => {
            // Check if there is a valid token in AsyncStorage
            const userData = await AsyncStorage.getItem('userData')
            if (!userData) {
                // Not logged in
                props.navigation.navigate('Auth')
                return
            }
            const transformedData = JSON.parse(userData)
            const {token, userId, expiryDate } = transformedData

            const expirationDate = new Date(expiryDate)

            if (expirationDate <= new Date() || !token || !userId) {
                // Invalid token / token expired
                props.navigation.navigate('Auth')
                return
            }

            props.navigation.navigate('App')
            dispatch(authActions.authenticate(userId, token))
        }
        tryLogin()
    }, [dispatch])

    return (
    <View style={styles.container}>
        <ActivityIndicator size='large' color={Colors.primary}/>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartupScreen