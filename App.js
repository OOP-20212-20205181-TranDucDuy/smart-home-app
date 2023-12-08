import React, { useState,useEffect,useCallback,useRef } from 'react';
import { NavigationContainer,useNavigation  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignupScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import Welcome from './screens/Welcome'
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import { Provider } from 'react-redux';
import store from './redux/store';
import HomeDetail from './screens/HomeDetail';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import { firebase } from '@react-native-firebase/app';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const Stack = createStackNavigator();

export default function App() {
  
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  useEffect(() =>{
    if(requestUserPermission()){
      messaging().onNotificationOpenedApp( async (remoteMessage) => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
      });
    }
    else{
      console.log("Permission denied", authStatus)
    }
   

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Message handled in the background!', remoteMessage);
      });
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      });
  
    return unsubscribe;
  
  })
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName= 'Login'  screenOptions={{ headerLeft: false }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="Signup"
          component={SignUpScreen}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="Forgotpassword"
          component={ForgotPasswordScreen}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="VerifyEmailScreen"
          component={VerifyEmailScreen}
          options={{ title: '' }}
        />
          <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="HomeDetail"
          component={HomeDetail}
          options={{ title: '' }}
        />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}
