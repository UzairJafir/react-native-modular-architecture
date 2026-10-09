import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTransactions } from '../../context/TransactionContext';

export default function ProfileScreen({ navigation }) {
  // Global context se profileImage aur update function le rahe hain
  const { currentUser, profileImage, updateProfileImage } = useTransactions() || {};

  const [showFullCnic, setShowFullCnic] = useState(false);
  const [pinChangeModal, setPinChangeModal] = useState(false);

  const userName = currentUser?.name || 'Jamal Khan';
  const userEmail = currentUser?.email || 'jamal@example.com';
  const maskedCnic = '35202-*******-1';
  const fullCnic = '35202-1234567-1';

  // Function to pick photo and store in Global Context
  const handlePickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        alert('Error picking image: ' + response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const selectedUri = response.assets[0].uri;
        if (typeof updateProfileImage === 'function') {
          updateProfileImage(selectedUri); // Global State Save
        }
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Security & Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar & Image Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handlePickImage}
            activeOpacity={0.8}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
              </View>
            )}

            {/* Camera Upload Badge */}
            <View style={styles.cameraBadge}>
              <Text style={{ fontSize: 12, color: '#FFFFFF' }}>📷</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.userNameText}>{userName}</Text>
          <Text style={styles.userEmailText}>{userEmail}</Text>

          {/* Verification Badge */}
          <View style={styles.kycBadge}>
            <Text style={styles.kycBadgeText}>🛡️ Identity Verified (Level 2)</Text>
          </View>
        </View>

        {/* Identity & Legal Information Section (KYC) */}
        <Text style={styles.sectionTitle}>Identity & Verification (KYC)</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>CNIC / National ID</Text>
              <Text style={styles.infoValue}>
                {showFullCnic ? fullCnic : maskedCnic}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.eyeToggleBtn}
              onPress={() => setShowFullCnic(!showFullCnic)}>
              <Text style={{ fontSize: 14 }}>{showFullCnic ? '🔒' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Daily Transfer Limit</Text>
              <Text style={styles.infoValue}>Rs. 500,000 / Day</Text>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Active</Text>
            </View>
          </View>
        </View>

        {/* Security Controls Section */}
        <Text style={styles.sectionTitle}>Security Settings</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => setPinChangeModal(true)}>
          <Text style={{ fontSize: 20, marginRight: 12 }}>🔑</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Transaction Security PIN</Text>
            <Text style={styles.actionSub}>Update your 5-Digit authorization code</Text>
          </View>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>

        <View style={styles.actionCard}>
          <Text style={{ fontSize: 20, marginRight: 12 }}>📲</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Active Login Session</Text>
            <Text style={styles.actionSub}>Android 14 • Lahore, Pakistan (Active Now)</Text>
          </View>
          <View style={styles.greenDot} />
        </View>
      </ScrollView>

      {/* Security PIN Alert Modal */}
      <Modal visible={pinChangeModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 32, marginBottom: 10 }}>🔒</Text>
            <Text style={styles.modalTitle}>Security PIN</Text>
            <Text style={styles.modalSub}>
              Your current Transaction PIN is set to **12345**. You can enter this PIN to authorize transfers.
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setPinChangeModal(false)}>
              <Text style={styles.closeBtnText}>OK, Got It</Text>
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { padding: 8 },
  backText: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  content: { padding: 16 },

  // Profile Card & Avatar
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#02659B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563EB',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: { color: '#FFFFFF', fontSize: 28, fontWeight: '800' },
  userNameText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  userEmailText: { fontSize: 12, color: '#64748B', marginTop: 2, marginBottom: 12 },
  kycBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  kycBadgeText: { color: '#059669', fontSize: 11, fontWeight: '800' },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 6,
  },

  // Info Card
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 11, color: '#64748B', fontWeight: '700' },
  infoValue: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  eyeToggleBtn: { padding: 6, backgroundColor: '#F1F5F9', borderRadius: 8 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  activeTag: { backgroundColor: '#DEF7EC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  activeTagText: { color: '#03543F', fontSize: 11, fontWeight: '700' },

  // Action Cards
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  actionSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  arrowText: { fontSize: 20, color: '#94A3B8', fontWeight: 'bold' },
  greenDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  modalSub: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  closeBtn: { backgroundColor: '#02659B', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  closeBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
});