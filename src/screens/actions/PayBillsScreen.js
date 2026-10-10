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
import { useSecurity } from '../../hooks/useSecurity';

const BILL_CATEGORIES = [
  { id: '1', title: 'Electricity', icon: '⚡' },
  { id: '2', title: 'Gas', icon: '🔥' },
  { id: '3', title: 'Water', icon: '💧' },
  { id: '4', title: 'Internet', icon: '🌐' },
];

export default function PayBillsScreen({ navigation }) {
  const { balance = 245500, addTransaction, isUserBlocked, currentUser } = useTransactions() || {};
  const { verifyAndAuthorize, logMpinEvent, logTransactionSuccess } = useSecurity();

  const [selectedCategory, setSelectedCategory] = useState('Electricity');
  const [consumerNum, setConsumerNum] = useState('');
  const [billAmount, setBillAmount] = useState('0');

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

  const handlePayBillClick = () => {
    const cleanConsumer = (consumerNum || '').trim();
    const numericAmount = parseFloat(billAmount);

    if (!cleanConsumer || cleanConsumer.length < 6) {
      showAlert('Invalid Consumer No.', 'Please enter a valid Consumer/Reference Number (min 6 digits).', 'error');
      return;
    }

    // Enterprise Security Middleware & Validation Gate
    const securityCheck = verifyAndAuthorize({
      amount: numericAmount,
      recipient: `${selectedCategory} (${cleanConsumer})`,
      userBalance: balance,
      actionType: 'PAY_BILL_ATTEMPT',
    });

    if (!securityCheck.allowed) {
      showAlert('Security Check Failed ⚠️', securityCheck.message, 'error');
      return;
    }

    // Trigger PIN Lock Screen
    setPinModalVisible(true);
  };

  const handlePinSuccess = () => {
    setPinModalVisible(false);
    const numericAmount = parseFloat(billAmount);
    const cleanConsumer = (consumerNum || '').trim();

    // Log MPIN Verification Event in Audit Log
    logMpinEvent('SUCCESS', {
      action: 'Bill Payment',
      category: selectedCategory,
      recipient: cleanConsumer,
      amount: numericAmount,
    });

    if (typeof addTransaction === 'function') {
      addTransaction({
        id: Date.now().toString(),
        title: `${selectedCategory} Bill`,
        amount: numericAmount,
        type: 'expense',
        category: 'Utilities',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      });
    }

    const txId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    // Log Successful Transaction in Enterprise Audit Logger
    logTransactionSuccess({
      txId,
      type: 'Bill Payment',
      category: selectedCategory,
      recipient: cleanConsumer,
      amount: numericAmount,
    });

    showAlert(
      'Payment Successful 🎉',
      `${selectedCategory} bill of Rs. ${numericAmount.toLocaleString()} paid successfully! (Ref: ${txId})`,
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
        <Text style={styles.headerTitle}>Pay Utility Bills</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Select Category</Text>
        <View style={styles.categoriesGrid}>
          {BILL_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catCard,
                selectedCategory === cat.title && styles.selectedCat,
              ]}
              onPress={() => setSelectedCategory(cat.title)}>
              <Text style={{ fontSize: 24, marginBottom: 4 }}>{cat.icon}</Text>
              <Text style={styles.catText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Consumer Reference Number</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 14 12345 67890 1"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={consumerNum}
            onChangeText={setConsumerNum}
          />
        </View>

        <Text style={styles.label}>Bill Amount</Text>
        <View style={styles.amountBox}>
          <Text style={styles.currencyPrefix}>Rs. </Text>
          <TextInput
            style={styles.amountInput}
            value={billAmount}
            onChangeText={(text) => setBillAmount(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handlePayBillClick}>
          <Text style={styles.submitBtnText}>Pay Rs. {billAmount || '0'}</Text>
        </TouchableOpacity>
      </View>

      {/* Security PIN Authorization Modal */}
      <PinModal
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        onSuccess={handlePinSuccess}
        title="Authorize Bill Payment"
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
  label: { fontSize: 13, fontWeight: '700', color: '#64748B', marginTop: 16, marginBottom: 10 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  catCard: { width: '48%', backgroundColor: '#F8FAFC', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  selectedCat: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  catText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  inputCard: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, height: 50, justifyContent: 'center' },
  textInput: { fontSize: 15, color: '#0F172A' },
  amountBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  currencyPrefix: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  amountInput: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
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