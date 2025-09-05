import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="home-outline" size={size} color={color} />;
          },
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="log-in-outline" size={size} color={color} />;
          },
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="person-add-outline" size={size} color={color} />;
          },
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="checkmark-circle-outline" size={size} color={color} />;
          },
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}