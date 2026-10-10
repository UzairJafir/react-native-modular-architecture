import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function PinModal({
  visible,
  onClose,
  onSuccess,
  title = 'Secure Payment Authorization',
  subtitle = 'To complete your transaction, please enter your 4-digit MPIN.',
  amount = '500',
  attemptsLeft = 3,
}) {
  const PIN_LENGTH = 4;
  const DEFAULT_PIN = '1234';

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPinText, setShowPinText] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(attemptsLeft);

  useEffect(() => {
    if (visible) {
      setPin('');
      setErrorMsg('');
      setShowPinText(false);
      setRemainingAttempts(attemptsLeft);
    }
  }, [visible, attemptsLeft]);

  // Keypad Number Press Handler
  const handlePressNumber = (num) => {
    if (pin.length < PIN_LENGTH) {
      setPin((prevPin) => prevPin + num);
      setErrorMsg('');
    }
  };

  // Backspace / Delete Handler
  const handleDelete = () => {
    if (pin.length > 0) {
      setPin((prevPin) => prevPin.slice(0, -1));
      setErrorMsg('');
    }
  };

  // Manual Confirmation Handler
  const handleConfirmSubmit = () => {
    if (pin.length < PIN_LENGTH) {
      setErrorMsg('Please enter a complete 4-digit MPIN.');
      return;
    }

    if (pin === DEFAULT_PIN) {
      setErrorMsg('');
      onSuccess();
    } else {
      const nextAttempts = remainingAttempts - 1;
      setRemainingAttempts(nextAttempts);
      setPin('');

      if (nextAttempts > 0) {
        setErrorMsg(
          `Authentication Failed. Incorrect MPIN. You have ${nextAttempts} attempt${
            nextAttempts > 1 ? 's' : ''
          } remaining.`
        );
      } else {
        setErrorMsg('Account Temporarily Locked due to multiple failed attempts.');
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#111827" />

        {/* Top Dark Banking Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={onClose} style={styles.headerIconBtn}>
            <Text style={styles.headerIconText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alert('Support Line: 111-FINFLOW')}
            style={styles.headerHelpBtn}>
            <Text style={styles.headerHelpText}>❓ Help</Text>
          </TouchableOpacity>
        </View>

        {/* Title & Transaction Context */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{title}</Text>
          <Text style={styles.subTitle}>
            {subtitle} {amount ? `[ Rs. ${amount} ]` : ''}
          </Text>
        </View>

        {/* MPIN Input Row & Action Links */}
        <View style={styles.mpinRowContainer}>
          <View style={styles.dotsRow}>
            {Array.from({ length: PIN_LENGTH }).map((_, index) => {
              const isFilled = index < pin.length;
              const charValue = pin[index];

              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    isFilled ? styles.dotFilled : styles.dotEmpty,
                    errorMsg ? styles.dotError : null,
                  ]}>
                  {isFilled && showPinText ? (
                    <Text style={styles.pinCharText}>{charValue}</Text>
                  ) : null}
                </View>
              );
            })}

            {/* Show / Hide Toggle */}
            <TouchableOpacity
              onPress={() => setShowPinText(!showPinText)}
              style={styles.eyeToggleBtn}>
              <Text style={{ fontSize: 18 }}>{showPinText ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => alert('Reset MPIN request initiated.')}>
            <Text style={styles.forgotText}>Reset MPIN?</Text>
          </TouchableOpacity>
        </View>

        {/* Error Feedback Badge */}
        {errorMsg ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        ) : (
          <View style={{ height: 24 }} />
        )}

        {/* Security Warning Notice */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            🔒 Protect your account. Do not share your MPIN with anyone.
          </Text>
        </View>

        {/* Custom Keypad Grid */}
        <View style={styles.keypadContainer}>
          <Text style={styles.keypadHeaderLabel}>Enter Passcode</Text>

          <View style={styles.keypadRow}>
            {['1', '2', '3'].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadTile}
                onPress={() => handlePressNumber(num)}>
                <Text style={styles.keypadNumText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {['4', '5', '6'].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadTile}
                onPress={() => handlePressNumber(num)}>
                <Text style={styles.keypadNumText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {['7', '8', '9'].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadTile}
                onPress={() => handlePressNumber(num)}>
                <Text style={styles.keypadNumText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {/* Empty Spacer Tile */}
            <View style={styles.keypadEmptyTile} />

            {/* Zero Button */}
            <TouchableOpacity
              style={styles.keypadTile}
              onPress={() => handlePressNumber('0')}>
              <Text style={styles.keypadNumText}>0</Text>
            </TouchableOpacity>

            {/* Backspace Button */}
            <TouchableOpacity style={styles.keypadTile} onPress={handleDelete}>
              <Text style={{ fontSize: 22, color: '#374151' }}>⌫</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[
              styles.confirmBtn,
              pin.length === PIN_LENGTH && remainingAttempts > 0
                ? styles.confirmBtnActive
                : styles.confirmBtnDisabled,
            ]}
            disabled={pin.length < PIN_LENGTH || remainingAttempts === 0}
            onPress={handleConfirmSubmit}>
            <Text style={styles.confirmBtnText}>Confirm MPIN ✓</Text>
          </TouchableOpacity>

          {/* Need Help Footer Link */}
          <TouchableOpacity
            style={styles.helpBtn}
            onPress={() => alert('Finflow Security Help Center')}>
            <Text style={styles.helpText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  topHeader: {
    height: 56,
    backgroundColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerIconBtn: { padding: 8 },
  headerIconText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  headerHelpBtn: { padding: 8 },
  headerHelpText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  titleSection: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 12 },
  mainTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 6 },
  subTitle: { fontSize: 13, color: '#4B5563', lineHeight: 18 },
  mpinRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 14,
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotEmpty: { backgroundColor: '#D1D5DB' },
  dotFilled: { backgroundColor: '#1E293B' },
  dotError: { backgroundColor: '#EF4444' },
  pinCharText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  eyeToggleBtn: { padding: 4, marginLeft: 4 },
  forgotText: { fontSize: 13, color: '#0284C7', fontWeight: '700' },
  errorContainer: {
    paddingHorizontal: 24,
    marginVertical: 4,
  },
  errorText: { color: '#DC2626', fontSize: 12, fontWeight: '700' },
  warningContainer: { paddingHorizontal: 24, marginVertical: 8 },
  warningText: { fontSize: 12, color: '#4B5563', fontWeight: '500' },
  keypadContainer: { marginTop: 'auto', paddingHorizontal: 20, paddingBottom: 16 },
  keypadHeaderLabel: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 10,
  },
  keypadRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  keypadTile: {
    width: '30%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  keypadEmptyTile: { width: '30%', height: 56 },
  keypadNumText: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  confirmBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  confirmBtnActive: { backgroundColor: '#02659B' },
  confirmBtnDisabled: { backgroundColor: '#94A3B8' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  helpBtn: { alignItems: 'center', paddingVertical: 8 },
  helpText: { fontSize: 12, fontWeight: '700', color: '#4B5568' },
});