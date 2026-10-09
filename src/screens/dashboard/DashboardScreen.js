import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '../../context/TransactionContext';

export default function DashboardScreen({ navigation }) {
  const { balance, transactions, currentUser } = useTransactions() || {};
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Security Feature: Privacy / Masking Toggle State
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const safeBalance = typeof balance === 'number' && !isNaN(balance) ? balance : 245500;
  const userNameDisplay = currentUser?.name || 'Muhammad Uzair';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.appHeader}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setDrawerOpen(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>FINFLOW</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('NotificationSettings')}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeText}>Welcome Back</Text>

        {/* Balance Card with Professional Privacy Toggle */}
        <View style={styles.balanceCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTypeLabel}>CURRENT ACCOUNT</Text>
            <TouchableOpacity
              onPress={() => setIsBalanceHidden(!isBalanceHidden)}
              style={styles.eyeBtn}
              activeOpacity={0.7}>
              <Text style={styles.eyeIconText}>
                {isBalanceHidden ? '🔒' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.accountNumber}>
            {isBalanceHidden ? 'PK** **** **** 8402' : '0170020200188402'}
          </Text>

          <Text style={styles.balanceAmount}>
            Rs. {isBalanceHidden ? '••••••••' : safeBalance.toLocaleString()}
          </Text>

          <Text style={styles.userName}>{userNameDisplay.toUpperCase()}</Text>
        </View>

        {/* Frequently Used Grid */}
        <Text style={styles.sectionTitle}>Frequently Used</Text>
        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('SendMoney', { mode: 'Send Money' })}>
            <Text style={{ fontSize: 24 }}>💸</Text>
            <Text style={styles.gridTitle}>Send Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('CardDetails')}>
            <Text style={{ fontSize: 24 }}>💳</Text>
            <Text style={styles.gridTitle}>My Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('SendMoney', { mode: 'Add Money' })}>
            <Text style={{ fontSize: 24 }}>➕</Text>
            <Text style={styles.gridTitle}>Add Money</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('MobileRecharge')}>
            <Text style={{ fontSize: 24 }}>📱</Text>
            <Text style={styles.gridTitle}>Recharge</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('PayBills')}>
            <Text style={{ fontSize: 24 }}>📄</Text>
            <Text style={styles.gridTitle}>Pay Bills</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('BudgetGoals')}>
            <Text style={{ fontSize: 24 }}>🎯</Text>
            <Text style={styles.gridTitle}>Budget Goals</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Recent Activity</Text>
        {transactions && transactions.length > 0 ? (
          transactions.map((tx) => (
            <View key={tx.id} style={styles.txCard}>
              <View style={styles.txLeft}>
                <View style={[styles.dot, { backgroundColor: tx.type === 'income' ? '#10B981' : '#EF4444' }]} />
                <View>
                  <Text style={styles.txTitle}>{tx.title || 'Transaction'}</Text>
                  <Text style={styles.txSubtitle}>{tx.category || 'General'} • {tx.date}</Text>
                </View>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#059669' : '#DC2626' }]}>
                {tx.type === 'income' ? '+' : '-'}Rs. {parseFloat(tx.amount || 0).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No recent activity</Text>
        )}
      </ScrollView>

      {/* Side Menu / Drawer Modal */}
      <Modal visible={drawerOpen} transparent animationType="fade">
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerUser}>{userNameDisplay}</Text>
              <Text style={styles.drawerHandle}>
                @{currentUser?.email ? currentUser.email.split('@')[0] : 'user'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => { setDrawerOpen(false); navigation.navigate('Profile'); }}>
              <Text style={styles.drawerIcon}>👤</Text>
              <Text style={styles.drawerText}>My Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => { setDrawerOpen(false); navigation.navigate('HelpCenter'); }}>
              <Text style={styles.drawerIcon}>❓</Text>
              <Text style={styles.drawerText}>Help Center & Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => { setDrawerOpen(false); navigation.navigate('NotificationSettings'); }}>
              <Text style={styles.drawerIcon}>🔔</Text>
              <Text style={styles.drawerText}>Notification Settings</Text>
            </TouchableOpacity>

            <View style={styles.drawerDivider} />

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => { setDrawerOpen(false); navigation.navigate('Login'); }}>
              <Text style={styles.drawerIcon}>🚪</Text>
              <Text style={[styles.drawerText, { color: '#EF4444' }]}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeDrawerBtn} onPress={() => setDrawerOpen(false)}>
              <Text style={styles.closeDrawerText}>Close Menu ✕</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ flex: 1 }} onPress={() => setDrawerOpen(false)} />
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, styles.activeNav]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate('HelpCenter')}>
          <Text style={styles.navIcon}>❓</Text>
          <Text style={styles.navLabel}>Help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate('NotificationSettings')}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navLabel}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  appHeader: {
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconBtn: { padding: 6 },
  menuIcon: { fontSize: 20, color: '#0F172A' },
  bellIcon: { fontSize: 18 },
  logoText: { fontSize: 18, fontWeight: '900', color: '#0F172A', letterSpacing: 1.5 },
  scrollContent: { padding: 16, paddingBottom: 80 },
  welcomeText: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 14 },

  // Balance Card with Professional Security Badge Style
  balanceCard: { backgroundColor: '#02659B', borderRadius: 16, padding: 18, marginBottom: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTypeLabel: { color: '#93C5FD', fontSize: 11, fontWeight: '800' },
  eyeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
  },
  eyeIconText: { fontSize: 14, color: '#FFFFFF' },
  accountNumber: { color: '#E0F2FE', fontSize: 12, marginTop: 4, fontWeight: '600' },
  balanceAmount: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold', marginTop: 10 },
  userName: { color: '#E0F2FE', fontSize: 12, fontWeight: '700', marginTop: 6 },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  gridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  gridTitle: { fontSize: 11, fontWeight: '600', color: '#1E293B', marginTop: 6 },
  txCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  txLeft: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  txTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  txSubtitle: { fontSize: 11, color: '#64748B', marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginVertical: 12 },

  // Drawer Styles
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', flexDirection: 'row' },
  drawerContainer: {
    width: '75%',
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 50,
  },
  drawerHeader: { paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 16 },
  drawerUser: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  drawerHandle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  drawerIcon: { fontSize: 18, marginRight: 14 },
  drawerText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  drawerDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  closeDrawerBtn: { marginTop: 'auto', padding: 12, alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10 },
  closeDrawerText: { fontSize: 12, fontWeight: '700', color: '#64748B' },

  // Bottom Navigation Bar Styles
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 8,
  },
  navTab: { alignItems: 'center' },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#64748B', fontWeight: '600', marginTop: 2 },
  activeNav: { color: '#02659B', fontWeight: '800' },
});