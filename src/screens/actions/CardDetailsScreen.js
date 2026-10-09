import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '../../context/TransactionContext';

export default function CardDetailsScreen({ navigation }) {
  const transactionContext = useTransactions() || {};
  const { transactions = [], isUserBlocked, currentUser } = transactionContext;
  const [isFrozen, setIsFrozen] = useState(false);

  // Custom Sweet Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleActionClick = (actionType) => {
    // 1. STRICT ADMIN BLOCK CHECK
    if (typeof isUserBlocked === 'function' && isUserBlocked(currentUser?.email)) {
      showAlert(
        'Account Suspended 🚫',
        'Your account has been restricted by the administrator. Card actions are disabled.',
        'error'
      );
      return;
    }

    if (actionType === 'pin') {
      showAlert('Security PIN 🔒', 'Your Security PIN is: 4589', 'info');
    } else if (actionType === 'replace') {
      showAlert('Card Replacement 🔄', 'A new Debit Card dispatch request has been submitted.', 'success');
    } else if (actionType === 'report') {
      showAlert('Report Emergency 🚨', 'Please call the helpline or freeze your card immediately.', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* App Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Details</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => handleActionClick('pin')}>
          <Text style={styles.moreIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Visa Card UI */}
        <View style={[styles.creditCard, isFrozen && styles.frozenCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardBrand}>FINFLOW VISA</Text>
            <Text style={styles.statusBadge}>{isFrozen ? 'FROZEN' : 'ACTIVE'}</Text>
          </View>

          <Text style={styles.cardNumber}>**** **** **** 4589</Text>

          <View style={styles.cardRow}>
            <View>
              <Text style={styles.cardMetaLabel}>EXPIRY</Text>
              <Text style={styles.cardMetaVal}>12/28</Text>
            </View>
            <View>
              <Text style={styles.cardMetaLabel}>CVV</Text>
              <Text style={styles.cardMetaVal}>***</Text>
            </View>
          </View>

          <View style={[styles.cardRow, { marginTop: 12 }]}>
            <Text style={styles.holderName}>
              {(currentUser?.name || 'JAMAL KHAN').toUpperCase()}
            </Text>
            <Text style={styles.visaText}>VISA</Text>
          </View>
        </View>

        {/* Quick Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlPill}
            onPress={() => handleActionClick('pin')}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>🔒</Text>
            <Text style={styles.controlText}>View PIN</Text>
          </TouchableOpacity>

          <View style={styles.controlPill}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>❄️</Text>
            <Text style={styles.controlText}>Freeze Card</Text>
            <Switch
              value={isFrozen}
              onValueChange={(val) => {
                if (typeof isUserBlocked === 'function' && isUserBlocked(currentUser?.email)) {
                  showAlert('Account Suspended 🚫', 'Card controls are locked by administrator.', 'error');
                  return;
                }
                setIsFrozen(val);
              }}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={isFrozen ? '#2563EB' : '#F1F5F9'}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], marginLeft: 4 }}
            />
          </View>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => handleActionClick('replace')}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>🔄</Text>
              <Text style={styles.optionTitle}>Replace Card</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => handleActionClick('report')}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>🚨</Text>
              <Text style={[styles.optionTitle, { color: '#EF4444' }]}>Report Lost or Stolen</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <Text style={styles.sectionTitle}>Card Transactions</Text>
        {transactions && transactions.length > 0 ? (
          transactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={styles.txLeft}>
                <View style={styles.txIconCircle}>
                  <Text style={{ fontSize: 16 }}>{tx.type === 'income' ? '💰' : '💳'}</Text>
                </View>
                <View>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txSub}>{tx.date}</Text>
                </View>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#059669' : '#0F172A' }]}>
                {tx.type === 'income' ? '+' : '-'}Rs. {parseFloat(tx.amount || 0).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No recent transactions found.</Text>
        )}

      </ScrollView>

      {/* Sweet Alert Modal */}
      <Modal visible={alertVisible} transparent animationType="fade">
        <View style={styles.alertBackdrop}>
          <View style={styles.alertBox}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: alertConfig.type === 'success' ? '#DEF7EC' : alertConfig.type === 'error' ? '#FDE8E8' : '#E0F2FE' },
              ]}>
              <Text style={styles.alertIcon}>
                {alertConfig.type === 'success' ? '✓' : alertConfig.type === 'error' ? '⚠️' : 'ℹ️'}
              </Text>
            </View>

            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>

            <TouchableOpacity
              style={[
                styles.alertBtn,
                { backgroundColor: alertConfig.type === 'success' ? '#059669' : alertConfig.type === 'error' ? '#DC2626' : '#02659B' },
              ]}
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerBtn: { padding: 6 },
  backIcon: { fontSize: 20, color: '#0F172A', fontWeight: 'bold' },
  moreIcon: { fontSize: 18 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  scrollContent: { padding: 16 },
  creditCard: {
    backgroundColor: '#02659B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  frozenCard: { backgroundColor: '#64748B' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBrand: { color: '#93C5FD', fontSize: 11, fontWeight: '800' },
  statusBadge: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  cardNumber: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', letterSpacing: 2, marginVertical: 18 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardMetaLabel: { color: '#93C5FD', fontSize: 9, fontWeight: '700' },
  cardMetaVal: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', marginTop: 2 },
  holderName: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  visaText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16, fontStyle: 'italic' },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  controlPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  controlText: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  optionsList: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionIcon: { fontSize: 16, marginRight: 12 },
  optionTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  chevron: { fontSize: 18, color: '#94A3B8', fontWeight: 'bold' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  txRow: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  txLeft: { flexDirection: 'row', alignItems: 'center' },
  txIconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txTitle: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  txSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  txAmount: { fontSize: 13, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginVertical: 12 },

  // Sweet Alert Modal
  alertBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  alertBox: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center', elevation: 10 },
  iconBadge: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  alertIcon: { fontSize: 28, fontWeight: 'bold' },
  alertTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  alertMessage: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  alertBtn: { width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  alertBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});