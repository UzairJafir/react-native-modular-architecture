import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';

export default function BiometricModal({ visible, onClose, onSuccess, onFallbackPin }) {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (visible) {
      // Pulse animation for fingerprint icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  const handleSimulateScan = () => {
    // Simulate successful fingerprint/face match
    setTimeout(() => {
      onSuccess();
    }, 400);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Biometric Authentication</Text>
          <Text style={styles.subtitle}>
            Touch the fingerprint sensor or look at the screen to authorize transaction
          </Text>

          {/* Fingerprint Animated Sensor */}
          <TouchableOpacity onPress={handleSimulateScan} activeOpacity={0.8}>
            <Animated.View style={[styles.sensorCircle, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={{ fontSize: 44 }}>👆</Text>
            </Animated.View>
          </TouchableOpacity>

          <Text style={styles.hintText}>Tap sensor to verify fingerprint</Text>

          {/* Fallback to PIN option */}
          <TouchableOpacity style={styles.fallbackBtn} onPress={onFallbackPin}>
            <Text style={styles.fallbackText}>Use 5-Digit PIN Instead</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel Transaction</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    elevation: 10,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 18, marginBottom: 24 },
  sensorCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  hintText: { fontSize: 11, fontWeight: '600', color: '#3B82F6', marginBottom: 24 },
  fallbackBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 10,
  },
  fallbackText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  cancelBtn: { paddingVertical: 8 },
  cancelText: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
});