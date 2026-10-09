import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import colors from '../../theme/colors';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import { useTransactions } from '../../context/TransactionContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { registerUserInSystem } = useTransactions() || {};

  // Custom Sweet Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'error',
    title: '',
    message: '',
  });

  const showAlert = (title, message, type = 'error') => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleLogin = () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      showAlert('Validation Error', 'Please enter both email and password.', 'error');
      return;
    }

    // Admin Login Logic Check
    if (cleanEmail.toLowerCase() === 'admin@finflow.app') {
      navigation.replace('AdminDashboard');
      return;
    }

    // Automatically Register / Sync Logged-In User in Admin System
    if (typeof registerUserInSystem === 'function') {
      const derivedName = cleanEmail.split('@')[0].toUpperCase();
      registerUserInSystem({
        name: derivedName,
        email: cleanEmail,
      });
    }

    // Regular User Flow -> Navigate to OTP Verification
    navigation.navigate('OTP', {
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0],
      generatedOtp: '123456',
      isLogin: true,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.brandTitle}>Finflow</Text>
        <Text style={styles.screenTitle}>Welcome Back 👋</Text>
        <Text style={styles.screenSubtitle}>
          Sign in to your account to continue.
        </Text>

        <View style={styles.form}>
          <AppInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AppInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AppButton title="Login" onPress={handleLogin} />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Custom Sweet Alert Modal */}
      <Modal visible={alertVisible} transparent animationType="fade">
        <View style={styles.alertBackdrop}>
          <View style={styles.alertBox}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: alertConfig.type === 'success' ? '#DEF7EC' : '#FDE8E8' },
              ]}>
              <Text style={styles.alertIcon}>
                {alertConfig.type === 'success' ? '✓' : '⚠️'}
              </Text>
            </View>

            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>

            <TouchableOpacity
              style={[
                styles.alertBtn,
                { backgroundColor: alertConfig.type === 'success' ? '#059669' : '#DC2626' },
              ]}
              onPress={() => setAlertVisible(false)}>
              <Text style={styles.alertBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background || '#F8FAFC',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary || '#02659B',
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark || '#0F172A',
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 14,
    color: colors.textMuted || '#64748B',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textMuted || '#64748B',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary || '#02659B',
  },

  // Sweet Alert Styling
  alertBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  alertBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertIcon: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  alertBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  alertBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LoginScreen;