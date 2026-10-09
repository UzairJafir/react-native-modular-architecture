import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TransactionTile({ title, category, amount, type }) {
  const isCredit = type === 'credit';
  return (
    <View style={styles.tile}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      <Text style={[styles.amount, { color: isCredit ? '#10B981' : '#EF4444' }]}>
        {isCredit ? '+' : '-'}Rs. {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFFFFF', borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  category: { fontSize: 12, color: '#64748B', marginTop: 2 },
  amount: { fontSize: 16, fontWeight: 'bold' },
});