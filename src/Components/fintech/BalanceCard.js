import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BalanceCard({ balance, onSend, onPay, onRecharge }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Total Balance</Text>
      <Text style={styles.balanceText}>Rs. {balance.toLocaleString()}</Text>
      <Text style={styles.cardNumber}>**** **** **** 4589</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btn} onPress={onSend}>
          <Text style={styles.btnText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onPay}>
          <Text style={styles.btnText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onRecharge}>
          <Text style={styles.btnText}>Recharge</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1D4ED8', padding: 20, borderRadius: 16, marginVertical: 15 },
  label: { color: '#EFF6FF', fontSize: 14 },
  balanceText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginVertical: 8 },
  cardNumber: { color: '#93C5FD', fontSize: 12, marginBottom: 15 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  btnText: { color: '#1D4ED8', fontWeight: '600', fontSize: 12 },
});