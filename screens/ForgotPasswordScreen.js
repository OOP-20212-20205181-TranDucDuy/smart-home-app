import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      setIsResetLoading(true);
      // Implement your password reset logic here
      
      // Display a success message
      setMessage('Password reset instructions sent to your email.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/smart-home.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subTitle}>Enter your email to reset your password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Reset Password" onPress={handleResetPassword} disabled={isResetLoading} />
      <Text style={styles.errorText}>{error}</Text>
      <Text style={styles.successText}>{message}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>Back to Login</Text>
      </TouchableOpacity>
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
  subTitle: {
    fontSize: 16,
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
  successText: {
    color: 'green',
    marginBottom: 10,
  },
  backLink: {
    color: '#385898',
    fontSize: 16,
  },
});
