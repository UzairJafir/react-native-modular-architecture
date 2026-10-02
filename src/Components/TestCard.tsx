import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TestCardProps {
  title: string;
  status: 'PASS' | 'FAIL';
  children: React.ReactNode;
}

export const TestCard = ({ title, status, children }: TestCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={[styles.badge, status === 'PASS' ? styles.pass : styles.fail]}>
          {status === 'PASS' ? '✅ PASS' : '❌ FAIL'}
        </Text>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  badge: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  pass: { backgroundColor: '#d4edda', color: '#155724' },
  fail: { backgroundColor: '#f8d7da', color: '#721c24' },
  content: { marginTop: 4 },
});