import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '../../context/TransactionContext';
import PinModal from '../../components/common/PinModal';

const OPERATORS = [
  { id: '1', name: 'Jazz', color: '#DC2626' },
  { id: '2', name: 'Telenor', color: '#0284C7' },
  { id: '3', name: 'Zong', color: '#16A34A' },
  { id: '4', name: 'Ufone', color: '#EA580C' },
];

export default function MobileRechargeScreen({ navigation }) {
  const transactionContext = useTransactions() || {};
  const { balance = 245500, addTransaction, isUserBlocked, currentUser } = transactionContext;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('Jazz');
  const [amount, setAmount] = useState('500');

  // Security Modal & Alert State
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'success',
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

  const handleRechargeClick = () => {
    // 1. Admin Block Check
    if (typeof isUserBlocked === 'function' && isUserBlocked(currentUser?.email)) {
      showAlert(
        'Account Suspended 🚫',
        'Your account has been restricted by the administrator. Recharge operations are disabled.',
        'error'
      );
      return;
    }

    const numericAmount = parseFloat(amount);

    if (!phoneNumber || phoneNumber.length < 10) {
      showAlert('Invalid Number', 'Please enter a valid mobile number.', 'error');
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      showAlert('Invalid Amount', 'Please enter a valid recharge amount.', 'error');
      return;
    }

    if (numericAmount > balance) {
      showAlert('Insufficient Funds', 'You do not have enough balance for this recharge.', 'error');
      return;
    }

    // Trigger PIN Lock Screen
    setPinModalVisible(true);
  };

  const handlePinSuccess = () => {
    setPinModalVisible(false);
    const numericAmount = parseFloat(amount);

    if (typeof addTransaction === 'function') {
      addTransaction({
        id: Date.now().toString(),
        title: `${selectedOperator} Recharge`,
        amount: numericAmount,
        type: 'expense',
        category: 'Mobile Load',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      });
    }

    showAlert(
      'Recharge Successful 🎉',
      `${selectedOperator} Recharge of Rs. ${numericAmount.toLocaleString()} completed for ${phoneNumber}.`,
      'success',
      () => navigation.goBack()
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mobile Recharge</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.inputCard}>
          <Text style={styles.countryCode}>+92</Text>
          <TextInput
            style={styles.textInput}
            placeholder="300 1234567"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <Text style={styles.label}>Select Network Operator</Text>
        <View style={styles.operatorsRow}>
          {OPERATORS.map((op) => (
            <TouchableOpacity
              key={op.id}
              style={[
                styles.opCard,
                selectedOperator === op.name && { borderColor: op.color, borderWidth: 2 },
              ]}
              onPress={() => setSelectedOperator(op.name)}>
              <View style={[styles.opBadge, { backgroundColor: op.color }]} />
              <Text style={styles.opName}>{op.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Recharge Amount</Text>
        <View style={styles.amountInputBox}>
          <Text style={styles.currencyPrefix}>Rs. </Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.chipsRow}>
          {['200', '500', '1000', '2000'].map((val) => (
            <TouchableOpacity key={val} style={styles.chip} onPress={() => setAmount(val)}>
              <Text style={styles.chipText}>Rs. {val}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleRechargeClick}>
          <Text style={styles.submitBtnText}>Recharge Rs. {amount || '0'}</Text>
        </TouchableOpacity>
      </View>

      {/* Security PIN Authorization Modal */}
      <PinModal
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        onSuccess={handlePinSuccess}
        title="Authorize Mobile Recharge"
      />

      {/* Sweet Alert Modal */}
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
                {alertConfig.type === 'success' ? 'Continue' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backBtn: { padding: 8 },
  backText: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  content: { padding: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#64748B', marginTop: 16, marginBottom: 8 },
  inputCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, height: 50 },
  countryCode: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginRight: 10 },
  textInput: { flex: 1, fontSize: 16, color: '#0F172A' },
  operatorsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  opCard: { flex: 1, alignItems: 'center', backgroundColor: '#F8FAFC', paddingVertical: 12, borderRadius: 12, marginHorizontal: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  opBadge: { width: 12, height: 12, borderRadius: 6, marginBottom: 6 },
  opName: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  amountInputBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 },
  currencyPrefix: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  amountInput: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  chipsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  chip: { backgroundColor: '#F1F5F9', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  chipText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  submitBtn: { backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  alertBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  alertBox: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center', elevation: 10 },
  iconBadge: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  alertIcon: { fontSize: 28, fontWeight: 'bold' },
  alertTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  alertMessage: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  alertBtn: { width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  alertBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});