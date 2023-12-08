import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { baseUrl } from '../constant/base';
export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setIsSignUpLoading(true);
      const response = await axios.post(`${baseUrl}/auth/signup`,{
        email,
        password
      })
      navigation.navigate('VerifyEmail',{email});
      alert("Verify email to active account");
    } catch (err) {
      if(err.response.status == 400){
        setIsLoading(false);
        alert("Email has been used");
        navigation.navigate("Signup");
      }
      console.log(err);
      setError('Sign-up failed. Please try again.');
    } finally {
      setIsSignUpLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/smart-home.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Sign Up for SmartHomeApp</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
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
      <Button title="Sign Up" onPress={handleSignUp} disabled={isSignUpLoading} />
      <Text style={styles.errorText}>{error}</Text>
      <View style={styles.signInContainer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInLink}>Log In</Text>
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
    fontSize: 24,
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
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInLink: {
    color: '#385898',
    fontSize: 16,
    marginLeft: 5,
  },
});
