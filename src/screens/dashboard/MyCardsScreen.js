import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MyCardsScreen({ navigation }) {
  const cards = [
    { id: '1', type: 'Visa Gold Card', number: '**** **** **** 4589', expiry: '12/28', isFrozen: false },
    { id: '2', type: 'Mastercard Platinum', number: '**** **** **** 8821', expiry: '09/27', isFrozen: true },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cards</Text>
      {cards.map(card => (
        <TouchableOpacity
          key={card.id}
          style={[styles.cardItem, card.isFrozen && styles.frozenCard]}
          onPress={() => navigation.navigate('CardDetails', { card })}
        >
          <Text style={styles.cardType}>{card.type}</Text>
          <Text style={styles.cardNumber}>{card.number}</Text>
          <Text style={styles.expiry}>Expires: {card.expiry}</Text>
          {card.isFrozen && <Text style={styles.frozenTag}>STATUS: FROZEN</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', marginBottom: 20 },
  cardItem: { backgroundColor: '#0F172A', padding: 20, borderRadius: 12, marginBottom: 15 },
  frozenCard: { opacity: 0.6 },
  cardType: { color: '#93C5FD', fontWeight: 'bold', fontSize: 16 },
  cardNumber: { color: '#FFFFFF', fontSize: 18, marginVertical: 10 },
  expiry: { color: '#94A3B8', fontSize: 12 },
  frozenTag: { color: '#EF4444', fontWeight: 'bold', marginTop: 5 },
});