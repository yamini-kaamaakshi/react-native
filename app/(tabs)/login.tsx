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
import { validateUser, saveCurrentUser, getCurrentUser, getStoredUsers } from '@/utils/userStorage';

// Web-compatible alert function
const showAlert = (title: string, message: string, buttons?: Array<{text: string, onPress?: () => void, style?: string}>) => {
  if (Platform.OS === 'web') {
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
  const [isLoading, setIsLoading] = useState(false);
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
        console.log(`Auto-login successful for user: ${currentUser.email}`);
        router.push('/(tabs)/home');
      } else {
        console.log('No existing session found');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleLogin = async () => {
    // Validation
    if (email.trim() === '') {
      showAlert('Login Error', 'Email is required');
      return;
    }
    if (password.trim() === '') {
      showAlert('Login Error', 'Password is required');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showAlert('Login Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
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
        
        // Navigate to welcome tab
        router.push('/(tabs)/home');
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
                    router.push('/(tabs)/signup');
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
                    router.push('/(tabs)/signup');
                  }
                }
              ]
            );
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Authentication error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('timeout')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      showAlert('Login Failed', errorMessage);
    }
  };

  const resetForm = () => {
    try {
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error resetting form:', error);
      showAlert('Error', 'Failed to clear form. Please try again.');
    }
  };

  if (isCheckingSession) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Checking session...</Text>
      </View>
    );
  }

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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to your account</Text>
          
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              💡 New here? Don't have an account yet? Tap "Sign Up" below to create one!
            </Text>
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
          
          <TouchableOpacity 
            style={[styles.button, isLoading ? styles.buttonDisabled : null]} 
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={styles.toggleMode} 
              onPress={() => router.push('/(tabs)/signup')}
            >
              <Text style={styles.toggleModeText}>
                Don't have an account? Sign Up
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
    shadowColor: '#007AFF',
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