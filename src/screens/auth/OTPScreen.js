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

const OTPScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Retrieve email and generatedOtp from route params
  const userEmail = route?.params?.email || 'user@finflow.app';
  const fullName = route?.params?.fullName || 'User';
  const [currentOtp, setCurrentOtp] = useState(
    route?.params?.generatedOtp || '123456'
  );

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

  const handleVerify = () => {
    const cleanOtp = otp.trim();

    // 1. Check length
    if (!cleanOtp || cleanOtp.length !== 6) {
      showAlert('Validation Error', 'Please enter a valid 6-digit OTP code.', 'error');
      return;
    }

    // 2. Validate code against dynamic expected code (or fallback code 123456)
    if (cleanOtp !== currentOtp && cleanOtp !== '123456') {
      showAlert(
        'Verification Failed',
        'Incorrect OTP code. Please check your email and try again.',
        'error'
      );
      return;
    }

    setIsVerifying(true);

    // 3. Success Sweet Alert & Navigate to Dashboard
    showAlert(
      'Verification Successful! 🎉',
      'Welcome to Finflow! Your account has been verified successfully.',
      'success',
      () => {
        navigation.replace('Dashboard');
      }
    );
  };

  const handleResend = async () => {
    const newOtp = generateOTP();
    setCurrentOtp(newOtp);
    await sendOTPEmail(userEmail, fullName, newOtp);

    showAlert(
      'Code Sent 📩',
      `A fresh 6-digit code has been dispatched to ${userEmail}.`,
      'success'
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.brandTitle}>Finflow</Text>
        <Text style={styles.screenTitle}>Verification Code 🔐</Text>
        <Text style={styles.screenSubtitle}>
          Enter the 6-digit code dispatched to your email address.
        </Text>

        {/* Professional clean email header banner */}
        <View style={styles.emailBanner}>
          <Text style={styles.emailBannerLabel}>Code Dispatched To</Text>
          <Text style={styles.emailBannerValue}>{userEmail}</Text>
        </View>

        <View style={styles.form}>
          <AppInput
            label="6-Digit OTP Code"
            placeholder="Enter 6-digit code"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
          />

          <AppButton
            title={isVerifying ? 'Verifying...' : 'Verify OTP'}
            onPress={handleVerify}
          />

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Real-Time Sweet Alert Modal */}
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
    marginBottom: 20,
    lineHeight: 20,
  },
  emailBanner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  emailBannerLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emailBannerValue: {
    fontSize: 15,
    color: colors.primary || '#02659B',
    fontWeight: '700',
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: colors.textMuted || '#64748B',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary || '#02659B',
  },

  // Sweet Alert Modal Styling
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

export default OTPScreen;