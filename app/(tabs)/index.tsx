import React, { useState, useEffect } from 'react';
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
import { saveUser, validateUser, saveCurrentUser, getCurrentUser, getStoredUsers } from '@/utils/userStorage';

// Web-compatible alert function
const showAlert = (title: string, message: string, buttons?: Array<{text: string, onPress?: () => void, style?: string}>) => {
  if (Platform.OS === 'web') {
    // For web, use browser alert for now - in production you'd use a custom modal
    const result = window.confirm(`${title}\n\n${message}`);
    if (buttons && buttons.length > 1) {
      if (result && buttons[1]?.onPress) {
        buttons[1].onPress();
      } else if (!result && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    Alert.alert(title, message);
  }
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();

  // Check for existing user session on component mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        // User is already logged in, navigate to welcome page
        console.log(`Auto-login successful for user: ${currentUser.email}`);
        router.push('/(tabs)/welcome');
      } else {
        console.log('No existing session found');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      // Don't show user error for session check failures
      // Just log and continue to login screen
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleSubmit = async () => {
    if (isSignup) {
      // Signup validation
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
    } else {
      // Login validation
      if (email.trim() === '') {
        showAlert('Login Error', 'Email is required');
        return;
      }
      if (password.trim() === '') {
        showAlert('Login Error', 'Password is required');
        return;
      }
      // Basic email validation for login
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        showAlert('Login Error', 'Please enter a valid email address');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      if (isSignup) {
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
        
        router.push('/(tabs)/welcome');
      } else {
        // Validate user credentials
        const user = await validateUser(email.trim(), password);
        
        if (user) {
          // Save current user session
          await saveCurrentUser({
            id: user.id,
            username: user.username,
            email: user.email,
          });
          
          setIsLoading(false);
          // Clear the form
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setUsername('');
          
          // Navigate to welcome tab
          router.push('/(tabs)/welcome');
        } else {
          setIsLoading(false);
          // Check if any users exist to provide better error message
          const allUsers = await getStoredUsers();
          const userExists = allUsers.find(u => u.email === email.trim());
          
          if (userExists) {
            // User exists but password is wrong
            showAlert(
              'Login Failed', 
              'The password you entered is incorrect. Please check your password and try again.\n\nTip: Make sure Caps Lock is off and check for typos.'
            );
          } else {
            // Check if there are any users at all
            if (allUsers.length === 0) {
              // No users exist yet - first time user
              showAlert(
                'Welcome! 👋', 
                `Looks like you're new here! No accounts exist yet.\n\nLet's create your first account with email "${email.trim()}".`,
                [
                  { text: 'Maybe Later', style: 'cancel' },
                  { 
                    text: 'Create Account', 
                    onPress: () => {
                      setIsSignup(true);
                      setPassword(''); // Clear password but keep email
                    }
                  }
                ]
              );
            } else {
              // Users exist but this email doesn't
              showAlert(
                'Email Not Found 🔍', 
                `We couldn't find an account with email "${email.trim()}".\n\n• Check if you spelled it correctly\n• Try a different email\n• Create a new account if you're new\n\nWould you like to create an account?`,
                [
                  { text: 'Try Again', style: 'cancel' },
                  { 
                    text: 'Create Account', 
                    onPress: () => {
                      setIsSignup(true);
                      setPassword(''); // Clear password but keep email
                    }
                  }
                ]
              );
            }
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Authentication error:', error);
      
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
      
      showAlert(isSignup ? 'Signup Failed' : 'Login Failed', errorMessage);
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

  const toggleMode = () => {
    try {
      if (isLoading) {
        showAlert('Please Wait', 'Please wait for the current operation to complete before switching modes.');
        return;
      }
      
      setIsSignup(!isSignup);
      resetForm();
    } catch (error) {
      console.error('Error toggling mode:', error);
      showAlert('Error', 'Failed to switch between login and signup modes. Please try again.');
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
        <View style={styles.loginCard}>
          <Text style={styles.title}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignup ? 'Sign up to create your account' : 'Sign in to continue to your account'}
          </Text>
          
          {!isSignup ? (
            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                💡 New here? Don't have an account yet? Tap "Sign Up" below to create one!
              </Text>
            </View>
          ) : null}
          
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
          
          {isSignup ? (
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
          ) : null}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>
          
          {isSignup ? (
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
          ) : null}
          
          <TouchableOpacity 
            style={[styles.button, isLoading ? styles.buttonDisabled : null]} 
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading 
                ? (isSignup ? 'Creating Account...' : 'Signing In...') 
                : (isSignup ? 'Sign Up' : 'Sign In')
              }
            </Text>
          </TouchableOpacity>
          
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.toggleMode} onPress={toggleMode}>
              <Text style={styles.toggleModeText}>
                {isSignup 
                  ? 'Already have an account? Sign In' 
                  : 'Don\'t have an account? Sign Up'
                }
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
  loginCard: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
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
  helpContainer: {
    backgroundColor: '#E8F4FD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#B8E0FF',
  },
  helpText: {
    fontSize: 14,
    color: '#1565C0',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
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
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    boxShadow: '0px 4px 8px rgba(0, 122, 255, 0.3)',
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