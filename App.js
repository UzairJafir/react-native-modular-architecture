import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransactionProvider } from './src/context/TransactionContext';

// Auth Screens
import SplashScreen from './src/screens/auth/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import OTPScreen from './src/screens/auth/OTPScreen';

// Dashboard & Action Screens
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import SendMoneyScreen from './src/screens/actions/SendMoneyScreen';
import CardDetailsScreen from './src/screens/actions/CardDetailsScreen';
import TransactionSuccessScreen from './src/screens/actions/TransactionSuccessScreen';
import MobileRechargeScreen from './src/screens/actions/MobileRechargeScreen';
import PayBillsScreen from './src/screens/actions/PayBillsScreen';
import BudgetGoalsScreen from './src/screens/actions/BudgetGoalsScreen';

// Admin Screen
import AdminDashboard from './src/screens/admin/AdminDashboard';

// Support & Profile Screens
import HelpCenterScreen from './src/screens/support/HelpCenterScreen';
import RaiseTicketScreen from './src/screens/support/RaiseTicketScreen';
import NotificationSettingsScreen from './src/screens/support/NotificationSettingsScreen';
import ProfileScreen from './src/screens/support/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <TransactionProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />

            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
            <Stack.Screen name="CardDetails" component={CardDetailsScreen} />
            <Stack.Screen name="TransactionSuccess" component={TransactionSuccessScreen} />
            <Stack.Screen name="MobileRecharge" component={MobileRechargeScreen} />
            <Stack.Screen name="PayBills" component={PayBillsScreen} />
            <Stack.Screen name="BudgetGoals" component={BudgetGoalsScreen} />

            {/* Admin Portal Screen */}
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />

            {/* Support Folder Screens */}
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="RaiseTicket" component={RaiseTicketScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </TransactionProvider>
    </SafeAreaProvider>
  );
}