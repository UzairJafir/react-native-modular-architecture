import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionSuccessScreen({ navigation, route }) {
  // Navigation parameters se values retrieve karna
  const type = route?.params?.type || 'Send Money';
  const recipient = route?.params?.recipient || 'Jamal Khan';
  const amount = route?.params?.amount || 0;
  const dateTime = route?.params?.dateTime || new Date().toLocaleString();
  const txId = route?.params?.txId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Success Icon Badge */}
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.statusTitle}>
          {type === 'Add Money' ? 'Money Added Successfully!' : 'Transaction Successful!'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {type === 'Add Money'
            ? 'Your wallet balance has been updated.'
            : `Payment to ${recipient} has been completed.`}
        </Text>

        {/* Amount Display */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>AMOUNT TRANSFERRED</Text>
          <Text style={styles.amountValue}>Rs. {amount.toLocaleString()}</Text>
        </View>

        {/* Receipt Details Card */}
        <View style={styles.receiptCard}>
          <Text style={styles.receiptHeader}>Transaction Details</Text>
          <View style={styles.divider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Transaction ID</Text>
            <Text style={styles.receiptValue}>{txId}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Payment Type</Text>
            <Text style={styles.receiptValue}>{type}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{type === 'Add Money' ? 'Source Account' : 'Recipient'}</Text>
            <Text style={styles.receiptValue}>{recipient}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Date & Time</Text>
            <Text style={styles.receiptValue}>{dateTime}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() => Alert.alert('Share Receipt', 'Receipt details copied to clipboard!')}>
          <Text style={styles.shareBtnText}>📄 Share Receipt</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Back to Home CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.homeBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 24, alignItems: 'center' },
  iconContainer: { marginTop: 20, marginBottom: 16 },
  successCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#BBF7D0',
  },
  checkMark: { fontSize: 36, color: '#16A34A', fontWeight: 'bold' },
  statusTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 6 },
  statusSubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  amountBox: {
    backgroundColor: '#F8FAFC',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  amountLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  amountValue: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginTop: 4 },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  receiptHeader: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 12 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  receiptLabel: { fontSize: 12, color: '#64748B' },
  receiptValue: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  statusBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { color: '#15803D', fontSize: 11, fontWeight: '700' },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
  },
  shareBtnText: { color: '#334155', fontSize: 14, fontWeight: '700' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  homeBtn: { backgroundColor: '#02659B', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  homeBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});