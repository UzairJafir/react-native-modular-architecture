import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpCenterScreen({ navigation }) {
  const faqs = [
    'How do I reset my password?',
    'How to update payment information?',
    'Can I change my email address?',
    'How to contact customer support?',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RaiseTicket')}>
          <Text style={styles.ticketBtnText}>+ Ticket</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={{ marginRight: 8, fontSize: 16 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help articles..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Filter Pills */}
        <View style={styles.pillRow}>
          <TouchableOpacity style={[styles.pill, styles.activePill]}>
            <Text style={styles.activePillText}>Getting Started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill}>
            <Text style={styles.pillText}>Account & Security</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Questions */}
        <Text style={styles.sectionTitle}>Popular Questions</Text>
        {faqs.map((faq, index) => (
          <TouchableOpacity key={index} style={styles.faqCard}>
            <Text style={styles.faqText}>{faq}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Support Categories */}
        <View style={styles.categoryRow}>
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.catIcon}>🔒</Text>
            <Text style={styles.catTitle}>Account & Security</Text>
            <Text style={styles.catDesc}>Password reset, account settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.catIcon}>💳</Text>
            <Text style={styles.catTitle}>Payments & Billing</Text>
            <Text style={styles.catDesc}>Transactions, refunds, limits</Text>
          </TouchableOpacity>
        </View>

        {/* Raise Ticket Prompt */}
        <TouchableOpacity
          style={styles.raiseBanner}
          onPress={() => navigation.navigate('RaiseTicket')}>
          <View>
            <Text style={styles.bannerTitle}>Still need help?</Text>
            <Text style={styles.bannerSubtitle}>Submit a ticket to our support team</Text>
          </View>
          <Text style={styles.bannerAction}>Raise Ticket →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: '#0F172A', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  ticketBtnText: { color: '#02659B', fontWeight: '700', fontSize: 13 },
  container: { padding: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A' },
  pillRow: { flexDirection: 'row', marginBottom: 20 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  activePill: { backgroundColor: '#02659B' },
  pillText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  activePillText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  faqCard: {
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
  faqText: { fontSize: 13, color: '#1E293B', fontWeight: '500' },
  arrow: { fontSize: 18, color: '#94A3B8' },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  categoryCard: {
    flex: 0.48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catIcon: { fontSize: 24, marginBottom: 8 },
  catTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  catDesc: { fontSize: 10, color: '#64748B', marginTop: 4 },
  raiseBanner: {
    backgroundColor: '#02659B',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  bannerSubtitle: { color: '#E0F2FE', fontSize: 11, marginTop: 2 },
  bannerAction: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});