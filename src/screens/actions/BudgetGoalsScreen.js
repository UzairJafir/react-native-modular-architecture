import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '../../context/TransactionContext';

export default function BudgetGoalsScreen({ navigation }) {
  const transactionContext = useTransactions() || {};
  const { balance = 0, addGoalFunds, isUserBlocked, currentUser } = transactionContext;

  // Active Savings Goals
  const [goals, setGoals] = useState([
    { id: '1', title: 'Trip to Goa', date: 'By December 2026', target: 3000, saved: 1350, icon: '✈️' },
    { id: '2', title: 'New Laptop', date: 'By March 2027', target: 2000, saved: 1400, icon: '💻' },
    { id: '3', title: 'Emergency Fund', date: 'By June 2027', target: 5000, saved: 1500, icon: '🛡️' },
  ]);

  // Add Funds Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [amountInput, setAmountInput] = useState('');

  // Custom Sweet Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'success',
    title: '',
    message: '',
  });

  const showAlert = (title, message, type = 'error') => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const totalTarget = goals.reduce((acc, curr) => acc + curr.target, 0);
  const totalSaved = goals.reduce((acc, curr) => acc + curr.saved, 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const openAddFundsModal = (goal) => {
    // 1. STRICT ADMIN BLOCK CHECK
    if (typeof isUserBlocked === 'function' && isUserBlocked(currentUser?.email)) {
      showAlert(
        'Account Suspended 🚫',
        'Your account has been restricted by the administrator. Savings operations are disabled.',
        'error'
      );
      return;
    }

    setSelectedGoal(goal);
    setAmountInput('');
    setModalVisible(true);
  };

  const handleConfirmAddFunds = () => {
    const numAmount = parseFloat(amountInput);

    if (isNaN(numAmount) || numAmount <= 0) {
      showAlert('Invalid Amount', 'Please enter a valid deposit amount.', 'error');
      return;
    }

    if (numAmount > balance) {
      showAlert('Insufficient Balance', `Your balance (Rs. ${balance.toLocaleString()}) is insufficient.`, 'error');
      return;
    }

    if (typeof addGoalFunds === 'function') {
      const success = addGoalFunds(selectedGoal.title, numAmount);

      if (success) {
        setGoals((prevGoals) =>
          prevGoals.map((g) =>
            g.id === selectedGoal.id ? { ...g, saved: g.saved + numAmount } : g
          )
        );

        setModalVisible(false);
        showAlert(
          'Goal Updated 🎉',
          `Rs. ${numAmount.toLocaleString()} added to "${selectedGoal.title}".`,
          'success'
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Budget Goals</Text>
          <Text style={styles.headerSubtitle}>Track your savings targets</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => showAlert('Feature Info', 'Creating new custom goals feature coming soon!', 'info')}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Total Savings Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Savings</Text>
          <View style={styles.summaryContent}>
            <View style={styles.percentageCircle}>
              <Text style={styles.percentageText}>{overallPercentage}%</Text>
            </View>

            <View style={styles.summaryDetails}>
              <Text style={styles.totalAmountText}>
                Rs. {totalSaved.toLocaleString()}
              </Text>
              <Text style={styles.targetAmountText}>
                of Rs. {totalTarget.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Goals List */}
        <Text style={styles.sectionTitle}>Your Active Goals</Text>

        {goals.map((item) => {
          const progress = Math.min(Math.round((item.saved / item.target) * 100), 100);

          return (
            <View key={item.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleRow}>
                  <View style={styles.iconContainer}>
                    <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                  </View>
                  <View>
                    <Text style={styles.goalTitle}>{item.title}</Text>
                    <Text style={styles.goalDate}>{item.date}</Text>
                  </View>
                </View>
                <Text style={styles.goalTarget}>Rs. {item.target.toLocaleString()}</Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
              </View>

              <View style={styles.goalFooterRow}>
                <Text style={styles.savedText}>Rs. {item.saved.toLocaleString()} saved</Text>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>

              <TouchableOpacity
                style={styles.addFundsBtn}
                onPress={() => openAddFundsModal(item)}>
                <Text style={styles.addFundsText}>Add Funds</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Add Funds Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Funds</Text>
            <Text style={styles.modalSubtitle}>
              Target: {selectedGoal?.title} (Saved: Rs. {selectedGoal?.saved.toLocaleString()})
            </Text>

            <Text style={styles.availableBalanceText}>
              Available Main Balance: Rs. {balance.toLocaleString()}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter amount (e.g. 500)"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={amountInput}
              onChangeText={setAmountInput}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={handleConfirmAddFunds}>
                <Text style={styles.confirmBtnText}>Add Funds</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Real-Time Sweet Alert Modal */}
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
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: '#0F172A', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  headerSubtitle: { fontSize: 11, color: '#64748B', marginTop: 2 },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#02659B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginTop: -2 },
  container: { padding: 16 },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  summaryLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  summaryContent: { flexDirection: 'row', alignItems: 'center' },
  percentageCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 5,
    borderColor: '#02659B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#F0F9FF',
  },
  percentageText: { fontSize: 15, fontWeight: '800', color: '#02659B' },
  summaryDetails: { justifyContent: 'center' },
  totalAmountText: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  targetAmountText: { fontSize: 12, color: '#64748B', marginTop: 2 },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  goalDate: { fontSize: 11, color: '#64748B', marginTop: 2 },
  goalTarget: { fontSize: 16, fontWeight: '800', color: '#0F172A' },

  progressBarBackground: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#02659B',
    borderRadius: 4,
  },
  goalFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  savedText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  progressText: { fontSize: 11, color: '#02659B', fontWeight: '700' },

  addFundsBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  addFundsText: { fontSize: 12, fontWeight: '700', color: '#02659B' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  modalSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 12 },
  availableBalanceText: { fontSize: 12, fontWeight: '600', color: '#059669', marginBottom: 12 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 16,
  },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelBtn: { backgroundColor: '#F1F5F9' },
  confirmBtn: { backgroundColor: '#02659B' },
  cancelBtnText: { color: '#64748B', fontWeight: '700', fontSize: 13 },
  confirmBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },

  // Sweet Alert Modal Styling
  alertBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  alertBox: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center', elevation: 10 },
  iconBadge: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  alertIcon: { fontSize: 28, fontWeight: 'bold' },
  alertTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  alertMessage: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  alertBtn: { width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  alertBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});