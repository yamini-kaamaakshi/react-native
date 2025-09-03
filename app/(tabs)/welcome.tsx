import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { logoutUser } from '../../utils/userStorage';

export default function WelcomeScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome! 👋</Text>
          <Text style={styles.welcomeMessage}>
            You have successfully logged in to your account.
          </Text>
          <Text style={styles.welcomeSubMessage}>
            Thank you for using our app. We hope you enjoy your experience!
          </Text>
        </View>

        <View style={styles.quickActionsCard}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openURL('https://www.linkedin.com/in/kaamaakshi-yamini-462b9b249/')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="logo-linkedin" size={24} color="#0A66C2" />
              </View>
              <Text style={styles.actionText}>LinkedIn</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openURL('https://github.com/yamini-kaamaakshi')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="logo-github" size={24} color="#333" />
              </View>
              <Text style={styles.actionText}>GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tip of the Day</Text>
          <Text style={styles.tipsText}>
              You can also use the React Native CLI to generate and run a release build (e.g. from the root of your project: yarn android --mode release
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleNavToLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
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
    width: '100%',
    maxWidth: 400,
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
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionIconContainer: {
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tipsCard: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    minWidth: 120,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 15,
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
});