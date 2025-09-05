import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
  Modal,
  Linking,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { logoutUser, getCurrentUser, UserSession } from '@/utils/userStorage';

export default function WelcomeScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 17) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };
    
    const loadCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    };
    
    updateGreeting();
    loadCurrentUser().catch(console.error);
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNavToLogout = () => {
    try {
      setShowLogoutModal(true);
    } catch (error) {
      console.error('Error showing logout modal:', error);
      Alert.alert('Error', 'Failed to open logout dialog. Please try again.');
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      await logoutUser();
      setShowLogoutModal(false);
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const openURL = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open the link');
    }
  };

  const handleProfilePress = () => {
    setShowProfileModal(true);
  };

  const handleProfileClose = () => {
    setShowProfileModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#fff" />
          </View>
          <Text style={styles.greetingText}>{greeting}! 👋</Text>
          <Text style={styles.userNameText}>Welcome back to your dashboard</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color="#667eea" />
            <Text style={styles.statNumber}>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#764ba2" />
            <Text style={styles.statNumber}>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
            <Text style={styles.statLabel}>Current Time</Text>
          </View>
        </View>

        <View style={styles.quickActionsCard}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openURL('https://www.linkedin.com/in/kaamaakshi-yamini-462b9b249/')}
            >
              <LinearGradient
                colors={['#0A66C2', '#0077B5']}
                style={styles.actionGradient}
              >
                <Ionicons name="logo-linkedin" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionText}>LinkedIn</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openURL('https://github.com/yamini-kaamaakshi')}
            >
              <LinearGradient
                colors={['#333', '#24292e']}
                style={styles.actionGradient}
              >
                <Ionicons name="logo-github" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionText}>GitHub</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Settings', 'Settings feature coming soon!')}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.actionGradient}
              >
                <Ionicons name="settings" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleProfilePress}
            >
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.actionGradient}
              >
                <Ionicons name="person" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tipsCard}>
          <LinearGradient
            colors={['#FEF3C7', '#FDE68A']}
            style={styles.tipsGradient}
          >
            <Ionicons name="bulb" size={24} color="#F59E0B" style={styles.tipIcon} />
            <Text style={styles.tipsTitle}>Tip of the Day</Text>
            <Text style={styles.tipsText}>
              Did you know? You can use React Native CLI to generate and run a release build directly from your project root. Try: yarn android --mode release
            </Text>
          </LinearGradient>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleNavToLogout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#DC2626', '#B91C1C']}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out" size={20} color="#fff" style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="slide"
        onRequestClose={handleProfileClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContainer}>
            <View style={styles.profileHeader}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.profileHeaderGradient}
              >
                <Ionicons name="person-circle" size={60} color="#fff" />
                <Text style={styles.profileHeaderTitle}>Profile Information</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.profileContent}>
              <View style={styles.profileField}>
                <Text style={styles.profileLabel}>Username</Text>
                <View style={styles.profileValueContainer}>
                  <Ionicons name="person" size={20} color="#667eea" style={styles.profileIcon} />
                  <Text style={styles.profileValue}>{currentUser?.username || 'Not available'}</Text>
                </View>
              </View>
              
              <View style={styles.profileField}>
                <Text style={styles.profileLabel}>Email</Text>
                <View style={styles.profileValueContainer}>
                  <Ionicons name="mail" size={20} color="#667eea" style={styles.profileIcon} />
                  <Text style={styles.profileValue}>{currentUser?.email || 'Not available'}</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.profileCloseButton}
              onPress={handleProfileClose}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.profileCloseGradient}
              >
                <Text style={styles.profileCloseText}>Close</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={handleLogoutCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout Confirmation</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <Text style={styles.modalSubMessage}>
              You will need to enter your credentials again to access your account.
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleLogoutCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogoutConfirm}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  gradientHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userNameText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  welcomeCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  welcomeMessage: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubMessage: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  statusActive: {
    color: '#10B981',
  },
  quickActionsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  actionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionIconContainer: {
    marginBottom: 5,
  },
  actionText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  tipsCard: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsGradient: {
    padding: 20,
    alignItems: 'center',
  },
  tipIcon: {
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 22,
    textAlign: 'center',
  },
  logoutButton: {
    alignSelf: 'center',
    marginTop: 20,
    minWidth: 140,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 350,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  modalSubMessage: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Profile Modal Styles
  profileModalContainer: {
    width: '90%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  profileHeader: {
    overflow: 'hidden',
  },
  profileHeaderGradient: {
    padding: 25,
    alignItems: 'center',
  },
  profileHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  profileContent: {
    padding: 25,
  },
  profileField: {
    marginBottom: 20,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  profileIcon: {
    marginRight: 12,
  },
  profileValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  profileCloseButton: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  profileCloseGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  profileCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});