import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser } from '@/utils/userStorage';

export default function HomePage() {
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

  if (isCheckingSession) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Ionicons name="rocket" size={80} color="#fff" />
          </View>
          
          <Text style={styles.title}>Welcome to MyApp</Text>
          <Text style={styles.subtitle}>
            Your journey starts here. Sign in to continue or create a new account to get started.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.loginButton]} 
              onPress={() => router.push('/(tabs)/login')}
              activeOpacity={0.8}
            >
              <Ionicons name="log-in" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.signupButton]} 
              onPress={() => router.push('/(tabs)/signup')}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add" size={20} color="#667eea" style={styles.buttonIcon} />
              <Text style={[styles.buttonText, styles.signupButtonText]}>Create Account</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Why choose us?</Text>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={20} color="#fff" />
              <Text style={styles.featureText}>Secure & Private</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="flash" size={20} color="#fff" />
              <Text style={styles.featureText}>Fast & Reliable</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="people" size={20} color="#fff" />
              <Text style={styles.featureText}>User Friendly</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  signupButton: {
    backgroundColor: '#fff',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  signupButtonText: {
    color: '#667eea',
  },
  featuresContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 10,
    fontWeight: '500',
  },
});