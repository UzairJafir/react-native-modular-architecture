import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen({ navigation }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Notification Channels</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>🔔 Push Notifications</Text>
              <Text style={styles.rowSub}>Receive instant notifications on your phone</Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: '#02659B' }} />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>✉️ Email Notifications</Text>
              <Text style={styles.rowSub}>Get transaction summaries to your inbox</Text>
            </View>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} trackColor={{ true: '#02659B' }} />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>💬 SMS Notifications</Text>
              <Text style={styles.rowSub}>Receive text messages for critical alerts</Text>
            </View>
            <Switch value={smsEnabled} onValueChange={setSmsEnabled} trackColor={{ true: '#02659B' }} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Alert Thresholds</Text>
        <View style={styles.card}>
          <Text style={styles.rowTitle}>Transaction Amount Threshold</Text>
          <TextInput
            style={styles.thresholdInput}
            defaultValue="Rs. 10,000"
            keyboardType="number-pad"
          />
          <Text style={styles.rowSub}>Alerts for transactions above this amount</Text>
        </View>

        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>🔊 Sound Alerts</Text>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} trackColor={{ true: '#02659B' }} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowTitle}>📳 Vibration</Text>
            <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} trackColor={{ true: '#02659B' }} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowTitle}>🌙 Quiet Hours</Text>
            <Switch value={quietHours} onValueChange={setQuietHours} trackColor={{ true: '#02659B' }} />
          </View>
        </View>
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
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 8, marginTop: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  rowSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  thresholdInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
  },
});