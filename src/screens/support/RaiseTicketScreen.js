import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RaiseTicketScreen({ navigation }) {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!issueType || !description) {
      Alert.alert('Required', 'Please select issue type and describe your issue.');
      return;
    }
    Alert.alert('Ticket Raised', 'Your ticket #TK-8492 has been submitted successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Raise a Ticket</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Issue Type</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setIssueType('Payment / Transaction Issue')}>
          <Text style={{ color: issueType ? '#0F172A' : '#94A3B8', fontSize: 14 }}>
            {issueType || 'Select issue type'}
          </Text>
          <Text style={{ color: '#64748B' }}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Please describe your issue in detail..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Screenshots (Optional)</Text>
        <TouchableOpacity style={styles.uploadBox}>
          <Text style={{ fontSize: 24 }}>☁️</Text>
          <Text style={styles.uploadText}>Tap to upload</Text>
          <Text style={styles.uploadSub}>Max size 10MB</Text>
        </TouchableOpacity>

        {/* Current Status Box */}
        <Text style={[styles.label, { marginTop: 20 }]}>Current Status</Text>
        <View style={styles.statusCard}>
          <View style={styles.dot} />
          <View>
            <Text style={styles.statusTitle}>New Ticket</Text>
            <Text style={styles.statusDate}>#TK-8491 • Created 2 hours ago</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Ticket</Text>
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
  container: { padding: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 8, marginTop: 10 },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 120,
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  uploadText: { fontSize: 13, fontWeight: '700', color: '#02659B', marginTop: 4 },
  uploadSub: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginRight: 12 },
  statusTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  statusDate: { fontSize: 11, color: '#64748B', marginTop: 2 },
  submitBtn: {
    backgroundColor: '#02659B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});