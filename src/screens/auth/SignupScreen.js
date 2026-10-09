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
import { generateOTP, sendOTPEmail } from '../../services/emailService';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Sweet Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'success', // 'success' | 'error'
    title: '',
    message: '',
    onConfirm: null,
  });

  const showAlert = (title, message, type = 'error', onConfirm = null) => {
    setAlertConfig({ title, message, type, onConfirm });
    setAlertVisible(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
  };

  const handleSignup = async () => {
    // 1. Validation Checks
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showAlert('Validation Error', 'Please fill in all required fields to proceed.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showAlert('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert('Weak Password', 'Password must be at least 6 characters long.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Password Mismatch', 'Passwords do not match. Please re-check.', 'error');
      return;
    }

    setIsSubmitting(true);

    // 2. Generate OTP & Send
    const generatedOtp = generateOTP();
    const result = await sendOTPEmail(email.trim(), fullName.trim(), generatedOtp);

    setIsSubmitting(false);

    const message = `A 6-digit verification code has been sent to ${email.trim()}. Please verify your account.`;

    showAlert('OTP Dispatched 📩', message, 'success', () => {
      navigation.navigate('OTP', {
        email: email.trim(),
        fullName: fullName.trim(),
        generatedOtp,
      });
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
        <Text style={styles.screenTitle}>Create Account 🚀</Text>
        <Text style={styles.screenSubtitle}>
          Sign up to get started with your smart digital wallet.
        </Text>

        <View style={styles.form}>
          <AppInput
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
          />
          <AppInput
            label="Email Address"
            placeholder="john@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AppInput
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AppInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <AppButton
            title={isSubmitting ? 'Sending OTP...' : 'Sign Up'}
            onPress={handleSignup}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Real-time Sweet Alert Modal */}
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
              onPress={handleAlertClose}>
              <Text style={styles.alertBtnText}>
                {alertConfig.type === 'success' ? 'Continue' : 'Try Again'}
              </Text>
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
    marginBottom: 10,
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
    marginBottom: 24,
    lineHeight: 20,
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

export default SignupScreen;