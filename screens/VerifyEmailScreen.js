import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { baseUrl } from '../constant/base';
import { useRoute } from '@react-navigation/native';
export default function VerifyEmailScreen({ navigation }) {
  const [OTP, setOTP] = useState('');
  const [error, setError] = useState('');
  const [isVerifyEmailLoading, setIsVerifyEmailLoading] = useState(false);
  const [isResendEmailLoading, setIsResendEmailLoading] = useState(false);
  const route = useRoute();
  const email = route.params?.email;
  const handleVerifyEmail = async () => {
    try {
      setIsVerifyEmailLoading(true);
      await axios.get(`${baseUrl}/auth/verify-email?email=${email}&otp=${OTP}`)
      navigation.navigate('Login');
      alert('Verify Success');
    } catch (err) {
      setError('Verify email failed. Please try again.');
    } finally {
      setIsVerifyEmailLoading(false);
    }
  };
  const handleResendEmail = async () => {
    try {
      setIsResendEmailLoading(true);
      await axios.post(`${baseUrl}/auth/resend-email`,{
        email
      });
      alert('Please check email again');
    } catch (error) {
      setError('Resend email failed. Please try again.');
    }
    finally{
      setIsResendEmailLoading(false);
    }

  }
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/smart-home.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Sign Up for SmartHomeApp</Text>
      <TextInput
        style={styles.input}
        placeholder="OTP"
        value={OTP}
        onChangeText={(text) => setOTP(text)}
      />
      <Button title="Verify" onPress={handleVerifyEmail} disabled={isVerifyEmailLoading} />
      <Text style={styles.errorText}>{error}</Text>
      <View style={styles.signInContainer}>
        <Text>Resend an otp ? </Text>
        <TouchableOpacity onPress={handleResendEmail} disabled={isResendEmailLoading}>
          <Text style={styles.signInLink}>Resend Email</Text>
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
