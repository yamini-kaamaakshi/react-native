import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { saveUser, saveCurrentUser } from '@/utils/userStorage';

// Web-compatible alert function
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    // Validation
    if (username.trim() === '') {
      showAlert('Validation Error', 'Username is required');
      return;
    }
    if (email.trim() === '') {
      showAlert('Validation Error', 'Email address is required');
      return;
    }
    if (password.trim() === '') {
      showAlert('Validation Error', 'Password is required');
      return;
    }
    if (confirmPassword.trim() === '') {
      showAlert('Validation Error', 'Please confirm your password');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('Validation Error', 'Passwords do not match. Please check and try again.');
      return;
    }
    if (password.length < 6) {
      showAlert('Validation Error', 'Password must be at least 6 characters long');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showAlert('Validation Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Save new user account
      const newUser = await saveUser({
        username: username.trim(),
        email: email.trim(),
        password: password, // In production, this should be hashed
      });
      
      // Auto-login the new user and navigate to welcome page
      await saveCurrentUser({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      });
      
      setIsLoading(false);
      // Clear the form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUsername('');
      
      router.push('/(tabs)/home');
    } catch (error) {
      setIsLoading(false);
      console.error('Signup error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          errorMessage = 'An account with this email or username already exists. Please try logging in or use different credentials.';
        } else if (error.message.includes('storage')) {
          errorMessage = 'Unable to save your information. Please check your device storage and try again.';
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      showAlert('Signup Failed', errorMessage);
    }
  };

  const resetForm = () => {
    try {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUsername('');
    } catch (error) {
      console.error('Error resetting form:', error);
      showAlert('Error', 'Failed to clear form. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.signupCard}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to create your account</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password (min 6 characters)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.button, isLoading ? styles.buttonDisabled : null]} 
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={styles.toggleMode} 
              onPress={() => router.push('/(tabs)/login')}
            >
              <Text style={styles.toggleModeText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.clearForm} onPress={resetForm}>
              <Text style={styles.clearFormText}>Clear Form</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  signupCard: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 52,
    borderColor: '#e0e0e0',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#28a745',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  toggleMode: {
    alignItems: 'center',
  },
  toggleModeText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  clearForm: {
    alignItems: 'center',
  },
  clearFormText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});