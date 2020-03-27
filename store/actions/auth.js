import { AsyncStorage } from 'react-native'

export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

export const authenticate = (userId, token) => {
  return {
    type: AUTHENTICATE,
    userId,
    token
  }
}

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
        const error = await response.json()
        const errorMessage = error.error.message
        let message = "An error has occured"
        switch (message) {
          case "EMAIL_EXISTS":
              message = "Email already exists"
              break;
          case "INVALID_PASSWORD":
              message = 'Password is invalid'
              break
        }
        throw new Error(message)
    }

    const resData = await response.json();
    dispatch(authenticate(resData.localId, resData.idToken))
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
    saveDataToStorage(resData.idToken, resData.localId, expirationDate)
  }
}

export const login = (email, password) => {
    return async dispatch => {
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?[API_KEY]',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
          })
        }
      );
  
      if (!response.ok) {
          const error = await response.json()
          const errorMessage = error.error.message
          let message = "An error has occured"
          switch (message) {
            case "EMAIL_NOT_FOUND":
                message = "Email does not exists"
                break;
            case "INVALID_PASSWORD":
                message = 'Password is invalid'
                break
          }
          throw new Error(message)
      }
  
      const resData = await response.json()
      dispatch(authenticate(resData.localId, resData.idToken))

      const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
      saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    };
  };

  export const logout = () => {
    return async dispatch => {
      AsyncStorage.setItem('userData', '')
      dispatch({type: LOGOUT})
    }
  }

  const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString()
    }))
  }
