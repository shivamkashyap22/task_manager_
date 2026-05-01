import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { AuthService } from '../../data/services/authService';
import { SignupScreenProps } from '../../navigation/types';
import { UserRole } from '../../domain/models/User';
import AppIcon from '../components/AppIcon';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await AuthService.signUp({ email, password, role });
      navigation.replace('TaskList'); 
    } catch (e: any) {
      console.error("Signup Error:", e.message);
      if (e.code === 'auth/email-already-in-use') {
        setError('This email address is already in use!');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#000000']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <AppIcon />
          </View>
          <Text style={styles.title}>CREATE ACCOUNT</Text>
          <Text style={styles.subtitle}>Join the system</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <TextInput
              label=""
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="you@domain.com"
              placeholderTextColor={COLORS.subtleText}
              keyboardType="email-address"
              autoCapitalize="none"
              theme={{
                colors: {
                  text: COLORS.text,
                  primary: COLORS.accent,
                  background: COLORS.card,
                },
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput
              label=""
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholder="Min 6 characters"
              placeholderTextColor={COLORS.subtleText}
              theme={{
                colors: {
                  text: COLORS.text,
                  primary: COLORS.accent,
                  background: COLORS.card,
                },
              }}
            />
          </View>

          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>SELECT ROLE</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'member' && styles.roleButtonActive,
                ]}
                onPress={() => setRole('member')}
              >
                <Text style={[
                  styles.roleButtonText,
                  role === 'member' && styles.roleButtonTextActive,
                ]}>MEMBER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'admin' && styles.roleButtonActive,
                ]}
                onPress={() => setRole('admin')}
              >
                <Text style={[
                  styles.roleButtonText,
                  role === 'admin' && styles.roleButtonTextActive,
                ]}>ADMIN</Text>
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#00d4aa', '#00a896']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>
              Already have access? <Text style={styles.linkText}>SIGN IN</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.subtleText,
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 10,
    color: COLORS.subtleText,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 10,
    color: COLORS.subtleText,
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 1,
  },
  roleButtonTextActive: {
    color: '#000',
  },
  errorText: {
    color: '#ff453a',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    height: 52,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 32,
    color: COLORS.subtleText,
    fontSize: 13,
  },
  linkText: {
    color: COLORS.accent,
    fontWeight: '700',
  },
});

export default SignupScreen;