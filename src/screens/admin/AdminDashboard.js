import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '../../context/TransactionContext';

export default function AdminDashboard({ navigation }) {
  const { usersList = [], transactions = [], toggleUserStatus } = useTransactions() || {};

  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const totalSystemBalance = usersList.reduce((acc, u) => acc + (u.balance || 0), 0);
  const activeUsersCount = usersList.filter((u) => u.status === 'Active').length;

  const handleStatusToggle = (user) => {
    setSelectedUser(user);
    setAlertVisible(true);
  };

  const confirmToggle = () => {
    if (selectedUser && typeof toggleUserStatus === 'function') {
      toggleUserStatus(selectedUser.id);
    }
    setAlertVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Admin Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.adminTitle}>Admin Portal 🛡️</Text>
          <Text style={styles.adminSubtitle}>Finflow System Control Center</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutText}>Exit Admin</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* System Overview Analytics Cards */}
        <Text style={styles.sectionTitle}>System Analytics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Users</Text>
            <Text style={styles.statValue}>{usersList.length}</Text>
            <Text style={styles.statSub}>{activeUsersCount} Active Accounts</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>System Vault</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>
              Rs. {totalSystemBalance.toLocaleString()}
            </Text>
            <Text style={styles.statSub}>Total Managed Funds</Text>
          </View>
        </View>

        {/* User Management Section */}
        <Text style={styles.sectionTitle}>User Management & Controls</Text>
        {usersList.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userBalance}>
                Balance: Rs. {parseFloat(user.balance || 0).toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.statusBadge,
                { backgroundColor: user.status === 'Active' ? '#DC2626' : '#16A34A' },
              ]}
              onPress={() => handleStatusToggle(user)}>
              <Text style={styles.statusText}>
                {user.status === 'Active' ? 'Block' : 'Unblock'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Global Activity Logs */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Global Transaction Feed</Text>
        {transactions && transactions.length > 0 ? (
          transactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View>
                <Text style={styles.txTitle}>{tx.title || 'Transaction'}</Text>
                <Text style={styles.txDate}>{tx.date || 'Recent'}</Text>
              </View>
              <Text style={styles.txAmount}>- Rs. {parseFloat(tx.amount || 0).toLocaleString()}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No transactions logged yet.</Text>
        )}
      </ScrollView>

      {/* Confirmation Sweet Alert Modal */}
      <Modal visible={alertVisible} transparent animationType="fade">
        <View style={styles.alertBackdrop}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Confirm Action ⚠️</Text>
            <Text style={styles.alertMessage}>
              Are you sure you want to {selectedUser?.status === 'Active' ? 'Block' : 'Unblock'}{' '}
              <Text style={{ fontWeight: 'bold' }}>{selectedUser?.name}</Text>?
            </Text>

            <View style={styles.alertBtnRow}>
              <TouchableOpacity
                style={[styles.alertBtn, { backgroundColor: '#64748B' }]}
                onPress={() => setAlertVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alertBtn, { backgroundColor: '#DC2626' }]}
                onPress={confirmToggle}>
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  adminTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  adminSubtitle: { fontSize: 12, color: '#94A3B8' },
  logoutBtn: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 12 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginVertical: 6 },
  statSub: { fontSize: 10, color: '#64748B' },
  userCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  userEmail: { color: '#94A3B8', fontSize: 12 },
  userBalance: { color: '#10B981', fontSize: 12, fontWeight: '600', marginTop: 4 },
  statusBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  txRow: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  txTitle: { color: '#E2E8F0', fontSize: 13, fontWeight: '600' },
  txDate: { color: '#64748B', fontSize: 10, marginTop: 2 },
  txAmount: { color: '#EF4444', fontWeight: '700', fontSize: 13 },
  emptyText: { color: '#64748B', textAlign: 'center', marginVertical: 10 },

  // Alert Modal
  alertBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  alertBox: { backgroundColor: '#FFFFFF', width: '100%', borderRadius: 16, padding: 20, alignItems: 'center' },
  alertTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  alertMessage: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 20 },
  alertBtnRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  alertBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});