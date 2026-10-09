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
  title = 'Authorize Transaction',
  subtitle = 'Enter your 4 digit MPIN and press Confirm',
}) {
  const PIN_LENGTH = 4;
  const DEFAULT_PIN = '1234';

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPinText, setShowPinText] = useState(false);

  useEffect(() => {
    if (visible) {
      setPin('');
      setErrorMsg('');
      setShowPinText(false);
    }
  }, [visible]);

  // Keypad Number Press Handler (Auto-submit disabled)
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

  // Manual Confirmation Handler (Triggered on OK / Confirm Button Click)
  const handleConfirmSubmit = () => {
    if (pin.length < PIN_LENGTH) {
      setErrorMsg('Kripya poora 4-digit MPIN enter karein.');
      return;
    }

    if (pin === DEFAULT_PIN) {
      setErrorMsg('');
      onSuccess(); // Successful Verification
    } else {
      setErrorMsg('Galat MPIN. Kripya dubara koshish karein.');
      setPin('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />

        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={onClose} style={styles.headerIconBtn}>
            <Text style={styles.headerIconText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.headerIconBtn}>
            <Text style={styles.headerIconText}>🏠</Text>
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{title}</Text>
          <Text style={styles.subTitle}>{subtitle}</Text>
        </View>

        {/* MPIN Display & Eye Toggle / Forgot MPIN */}
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
              <Text style={{ fontSize: 16 }}>{showPinText ? '🔒' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => alert('PIN Reset option triggered.')}>
            <Text style={styles.forgotText}>Forgot MPIN?</Text>
          </TouchableOpacity>
        </View>

        {/* Error Feedback */}
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <View style={{ height: 20 }} />
        )}

        {/* Security Warning Notice */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⓘ Never share your MPIN with anyone
          </Text>
        </View>

        {/* Custom Keypad Grid */}
        <View style={styles.keypadContainer}>
          <View style={styles.keypadRow}>
            {['1', '2', '3'].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadBtn}
                onPress={() => handlePressNumber(num)}>
                <Text style={styles.keypadNumText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {['4', '5', '6'].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadBtn}
                onPress={() => handlePressNumber(num)}>
                <Text style={styles.keypadNumText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {['7', '8', '9'].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keypadBtn}
                onPress={() => handlePressNumber(num)}>
                <Text style={styles.keypadNumText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {/* Empty Spacer */}
            <View style={styles.keypadBtn} />

            {/* Zero Button */}
            <TouchableOpacity
              style={styles.keypadBtn}
              onPress={() => handlePressNumber('0')}>
              <Text style={styles.keypadNumText}>0</Text>
            </TouchableOpacity>

            {/* Backspace Button */}
            <TouchableOpacity style={styles.keypadBtn} onPress={handleDelete}>
              <Text style={{ fontSize: 22, color: '#333333' }}>⌫</Text>
            </TouchableOpacity>
          </View>

          {/* Manual OK / Confirm Button */}
          <TouchableOpacity
            style={[
              styles.confirmBtn,
              pin.length === PIN_LENGTH
                ? styles.confirmBtnActive
                : styles.confirmBtnDisabled,
            ]}
            disabled={pin.length < PIN_LENGTH}
            onPress={handleConfirmSubmit}>
            <Text style={styles.confirmBtnText}>Confirm MPIN ✓</Text>
          </TouchableOpacity>

          {/* Need Help Footer */}
          <TouchableOpacity
            style={styles.helpBtn}
            onPress={() => alert('Support line: 111-FINFLOW')}>
            <Text style={styles.helpText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topHeader: {
    height: 56,
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerIconBtn: { padding: 8 },
  headerIconText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  titleSection: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 },
  mainTitle: { fontSize: 22, fontWeight: '800', color: '#1E1E1E', marginBottom: 4 },
  subTitle: { fontSize: 13, color: '#666666' },
  mpinRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 12,
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
  dotEmpty: { backgroundColor: '#E0E0E0' },
  dotFilled: { backgroundColor: '#1E1E1E' },
  dotError: { backgroundColor: '#E53E3E' },
  pinCharText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  eyeToggleBtn: { padding: 4, marginLeft: 4 },
  forgotText: { fontSize: 13, color: '#718096', fontWeight: '600' },
  errorText: { color: '#E53E3E', fontSize: 12, fontWeight: '700', paddingHorizontal: 24 },
  warningContainer: { paddingHorizontal: 24, marginVertical: 8 },
  warningText: { fontSize: 12, color: '#C53030' },
  keypadContainer: { marginTop: 'auto', paddingHorizontal: 20, paddingBottom: 16 },
  keypadRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  keypadBtn: { width: 75, height: 54, justifyContent: 'center', alignItems: 'center' },
  keypadNumText: { fontSize: 26, fontWeight: '700', color: '#1A202C' },
  confirmBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  confirmBtnActive: { backgroundColor: '#02659B' },
  confirmBtnDisabled: { backgroundColor: '#CBD5E1' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  helpBtn: { alignItems: 'center', paddingVertical: 8 },
  helpText: { fontSize: 12, fontWeight: '700', color: '#4A5568' },
});