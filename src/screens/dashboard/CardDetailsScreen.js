import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function CardDetailsScreen({ route }) {
  const { card } = route.params || { card: { type: 'Visa Gold Card', number: '**** **** **** 4589', expiry: '12/28' } };
  const [isFrozen, setIsFrozen] = useState(false);
  const [showPin, setShowPin] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{card.type}</Text>

      <View style={[styles.cardBox, isFrozen && styles.frozenBox]}>
        <Text style={styles.cardNum}>{card.number}</Text>
        <Text style={styles.text}>Expiry Date: {card.expiry}</Text>
        <Text style={styles.text}>Security PIN: {showPin ? '8842' : '****'}</Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, isFrozen ? styles.unfreezeBtn : styles.freezeBtn]}
        onPress={() => {
          setIsFrozen(!isFrozen);
          Alert.alert('Card Security', isFrozen ? 'Card Unfrozen Successfully' : 'Card Frozen Successfully');
        }}
      >
        <Text style={styles.btnText}>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSecondary} onPress={() => setShowPin(!showPin)}>
        <Text style={styles.btnTextSecondary}>{showPin ? 'Hide PIN' : 'View PIN'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', marginBottom: 20 },
  cardBox: { backgroundColor: '#1D4ED8', padding: 20, borderRadius: 12, marginBottom: 20 },
  frozenBox: { backgroundColor: '#64748B' },
  cardNum: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  text: { color: '#EFF6FF', fontSize: 14, marginBottom: 5 },
  btn: { padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  freezeBtn: { backgroundColor: '#EF4444' },
  unfreezeBtn: { backgroundColor: '#10B981' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold' },
  btnSecondary: { backgroundColor: '#E2E8F0', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnTextSecondary: { color: '#0F172A', fontWeight: 'bold' },
});