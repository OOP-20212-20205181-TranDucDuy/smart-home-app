import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity,LogBox } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../constant/base';
import { useDispatch } from 'react-redux';
import { login } from '../redux/auth';
import messaging from '@react-native-firebase/messaging';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const dispatch = useDispatch();
  const [deviceToken,setDeviceToken] = useState('');
  const handleLogin = async () => {
      messaging().getToken().then(token => {
        setDeviceToken(token)
        console.log(token);
      })
      try {
        console.log("Calling login");
        setIsLoginLoading(true);
        console.log(email);
        console.log(password)
        const response = await axios.post(`${baseUrl}/auth/login`, {
          email: email,
          password: password,
          deviceTokenString : deviceToken,
        });

        dispatch(login(response.data.accessToken, response.data.roles));
        if (response.data.roles === 'admin') {
          // Redirect to the admin dashboard
          alert("This is admin account please use user account")
        } else {
          // Redirect to the user's home page
          navigation.navigate('Welcome');
        }
      } catch (err) {
        console.log(err)
        setError('Invalid credentials. Please try again.');
      } finally {
        setIsLoginLoading(false);
      };  
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/smart-home.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Smart Home</Text>
      <TextInput
        style={styles.input}
        placeholder="Email or Phone"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} disabled={isLoginLoading} />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Forgotpassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signup}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  forgotPassword: {
    color: '#385898',
    fontSize: 16,
    marginBottom: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signup: {
    fontSize: 16,
  },
  signupLink: {
    color: '#385898',
    fontSize: 16,
    marginLeft: 5,
  },
});
