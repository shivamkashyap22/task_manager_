import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { AuthService } from '../../data/services/authService';
import { LoginScreenProps } from '../../navigation/types';
import AppIcon from '../components/AppIcon';
import { COLORS } from '../theme/colors';

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await AuthService.signIn({ email, password });

      navigation.replace('TaskList'); 

    } catch (e: any) {
      console.error("🔥 Login Error:", e.message);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AppIcon />
        
        
        <Text style={styles.title}>WELCOME</Text>
        
        <TextInput 
          label="Email Address" 
          value={email} 
          onChangeText={setEmail} 
          style={styles.input} 
          keyboardType="email-address" 
          autoCapitalize="none"
          mode="outlined"
          outlineColor={COLORS.primaryLight}
          activeOutlineColor={COLORS.primary}
        />
        
        <TextInput 
          label="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          style={styles.input}
          mode="outlined"
          outlineColor={COLORS.primaryLight}
          activeOutlineColor={COLORS.primary}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button 
          mode="contained" 
          onPress={handleLogin} 
          style={styles.button} 
          labelStyle={styles.buttonText} 
          loading={isLoading} 
          disabled={isLoading}
        >
          Log In
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.linkText}>Get started!</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { 
    flex: 1, 
    backgroundColor: COLORS.surface 
  },
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 24 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: COLORS.text, 
    textAlign: 'center', 
    marginBottom: 30 
  },
  input: { 
    backgroundColor: COLORS.background, 
    marginBottom: 16 
  },
  button: { 
    backgroundColor: COLORS.primary, 
    paddingVertical: 8, 
    borderRadius: 12, 
    marginTop: 10, 
    elevation: 4 
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: COLORS.white 
  },
  errorText: { 
    color: COLORS.danger, 
    textAlign: 'center', 
    marginBottom: 10 
  },
  footerText: { 
    textAlign: 'center', 
    marginTop: 20, 
    color: COLORS.subtleText 
  },
  linkText: { 
    color: COLORS.primary, 
    fontWeight: 'bold' 
  },
});

export default LoginScreen;