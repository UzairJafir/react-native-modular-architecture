import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';

// Dashboard & Home Screens (Dono Imports Correct Kiye Hain)
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import HomeScreen from '../screens/dashboard/HomeScreen';

// Action Screens
import SendMoneyScreen from '../screens/actions/SendMoneyScreen';
import CardDetailsScreen from '../screens/actions/CardDetailsScreen';
import TransactionSuccessScreen from '../screens/actions/TransactionSuccessScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Authentication Flow */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{ headerShown: false }}
        />

        {/* Dashboard Screen Fix 👇 */}
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Feature & Action Screens */}
        <Stack.Screen
          name="SendMoney"
          component={SendMoneyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CardDetails"
          component={CardDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransactionSuccess"
          component={TransactionSuccessScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}