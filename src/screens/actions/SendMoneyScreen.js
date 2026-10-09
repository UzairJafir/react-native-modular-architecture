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

export default function SendMoneyScreen({ navigation, route }) {
  const mode = route?.params?.mode || 'Send Money';
  const isAddMoney = mode === 'Add Money';

  const transactionContext = useTransactions() || {};
  const { balance = 0, addTransaction, isUserBlocked, currentUser } = transactionContext;

  const [amount, setAmount] = useState('5000');
  const [selectedRecipient, setSelectedRecipient] = useState('Jamal Khan');

  // Security Modal State
  const [pinModalVisible, setPinModalVisible] = useState(false);

  // Sweet Alert State
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

  const handleProceedClick = () => {
    // 1. Admin Block Check
    if (typeof isUserBlocked === 'function' && isUserBlocked(currentUser?.email)) {
      showAlert(
        'Account Suspended 🚫',
        `Your account has been restricted by administrator. ${mode} operations are disabled.`,
        'error'
      );
      return;
    }

    const numericAmount = parseFloat(String(amount).replace(/,/g, ''));

    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      showAlert('Validation Error', 'Please enter a valid transfer amount.', 'error');
      return;
    }

    if (!isAddMoney && numericAmount > balance) {
      showAlert('Insufficient Funds', `Your balance (Rs. ${balance.toLocaleString()}) is insufficient.`, 'error');
      return;
    }

    // Trigger Security PIN Authorization Modal
    setPinModalVisible(true);
  };

  const handlePinSuccess = () => {
    setPinModalVisible(false);

    const numericAmount = parseFloat(String(amount).replace(/,/g, ''));

    const newTx = {
      id: Date.now().toString(),
      title: isAddMoney ? 'Added to Wallet' : `Paid to ${selectedRecipient}`,
      amount: numericAmount,
      type: isAddMoney ? 'income' : 'expense',
      category: isAddMoney ? 'Income' : 'Transfer',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    if (typeof addTransaction === 'function') {
      addTransaction(newTx);
    }

    // Navigate to Success
    navigation.navigate('TransactionSuccess', {
      type: mode,
      recipient: isAddMoney ? 'Wallet Deposit' : selectedRecipient,
      amount: numericAmount,
      dateTime: new Date().toLocaleString(),
      txId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mode}</Text>
        <Text style={styles.helpIcon}>?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!isAddMoney && (
          <View>
            <View style={styles.searchBox}>
              <Text style={{ marginRight: 8 }}>🔍</Text>
              <TextInput placeholder="Search name or @username" placeholderTextColor="#94A3B8" />
            </View>

            <Text style={styles.sectionLabel}>Recents</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentsRow}>
              {['Sarah', 'Jamal', 'Ali', 'Usman'].map((name, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.avatarBtn,
                    selectedRecipient === name && styles.avatarSelected,
                  ]}
                  onPress={() => setSelectedRecipient(name)}>
                  <View style={styles.avatarCircle}>
                    <Text style={{ fontSize: 20 }}>👤</Text>
                  </View>
                  <Text style={styles.avatarName}>{name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.amountContainer}>
          <Text style={styles.currencyPrefix}>Rs. </Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.balanceText}>
          Available balance: Rs. {balance ? balance.toLocaleString() : '0'}
        </Text>

        <View style={styles.chipsRow}>
          {['500', '1000', '2500', '5000'].map((val) => (
            <TouchableOpacity key={val} style={styles.chip} onPress={() => setAmount(val)}>
              <Text style={styles.chipText}>Rs. {val}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>
          {isAddMoney ? 'Deposit From' : 'Payment Method'}
        </Text>
        <View style={styles.methodCard}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>💳</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>Current Account (**** 4589)</Text>
            <Text style={styles.methodSub}>Default Funding Source</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleProceedClick}>
          <Text style={styles.submitBtnText}>
            {isAddMoney ? `Add Rs. ${amount || '0'}` : `Send Rs. ${amount || '0'}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2-Factor Security PIN Modal */}
      <PinModal
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        onSuccess={handlePinSuccess}
        title="Authorize Transaction"
      />

      {/* Sweet Alert Modal */}
      <Modal visible={alertVisible} transparent animationType="fade">
        <View style={styles.alertBackdrop}>
          <View style={styles.alertBox}>
            <View style={[styles.iconBadge, { backgroundColor: '#FDE8E8' }]}>
              <Text style={styles.alertIcon}>⚠️</Text>
            </View>

            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>

            <TouchableOpacity
              style={[styles.alertBtn, { backgroundColor: '#DC2626' }]}
              onPress={() => setAlertVisible(false)}>
              <Text style={styles.alertBtnText}>Close</Text>
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
  helpIcon: { fontSize: 20, color: '#DC2626', fontWeight: 'bold', padding: 8 },
  content: { padding: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 12, height: 46, marginBottom: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 10, marginTop: 10 },
  recentsRow: { flexDirection: 'row', marginBottom: 16 },
  avatarBtn: { alignItems: 'center', marginRight: 16, opacity: 0.6 },
  avatarSelected: { opacity: 1 },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  avatarName: { fontSize: 12, color: '#334155', fontWeight: '600' },
  amountContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  currencyPrefix: { fontSize: 32, fontWeight: '800', color: '#0F172A' },
  amountInput: { fontSize: 32, fontWeight: '800', color: '#0F172A' },
  balanceText: { textAlign: 'center', color: '#64748B', fontSize: 13, marginTop: 6, marginBottom: 20 },
  chipsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  chip: { backgroundColor: '#F1F5F9', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  chipText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  methodCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  methodTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  methodSub: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
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