import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AppContext } from '../context/AppContext';
import { validateLoginInput } from '../middleware/authMiddleware';
import { handleLoginService } from '../services/userService';

export const HomeScreen = () => {
  const { theme } = useContext(AppContext);

  // Form Inputs State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Screen & Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [testLog, setTestLog] = useState<{ status: 'IDLE' | 'PASS' | 'FAIL'; message: string }>({
    status: 'IDLE',
    message: 'Enter details to test login flow.',
  });

  const handleTestLogin = async () => {
    setLoading(true);
    setTestLog({ status: 'IDLE', message: 'Running Middleware validation...' });

    // 1. Run Middleware Check
    const middlewareCheck = validateLoginInput(email, password);
    if (!middlewareCheck.isValid) {
      setTestLog({ status: 'FAIL', message: `[Middleware] ${middlewareCheck.message}` });
      setLoading(false);
      return;
    }

    // 2. Run API & Service Layer Test
    setTestLog({ status: 'IDLE', message: 'Calling Login API & Service...' });
    const result = await handleLoginService(email, password);

    if (result.success) {
      setTestLog({
        status: 'PASS',
        message: '✅ Login Successful! Redirecting...',
      });

      // 1 Second Timeout for Smooth Screen Transition
      setTimeout(() => {
        setUserName('Muhammad Uzair');
        setIsLoggedIn(true);
        setLoading(false);
      }, 800);
    } else {
      setTestLog({
        status: 'FAIL',
        message: `❌ Test Failed: ${result.message}`,
      });
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setTestLog({ status: 'IDLE', message: 'Enter details to test login flow.' });
  };

  // -------------------------------------------------------------
  // SUCCESS SCREEN (Jab Login Ho Jaye)
  // -------------------------------------------------------------
  if (isLoggedIn) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.card}>
          <Text style={styles.welcomeEmoji}>🎉</Text>
          <Text style={styles.welcomeText}>{userName} Welcome!</Text>
          <Text style={styles.subWelcomeText}>
            You have successfully passed the API, Service, & Middleware Test Case flow.
          </Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout / Test Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // -------------------------------------------------------------
  // LOGIN FORM SCREEN
  // -------------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Interactive Login Test Case</Text>
      <Text style={styles.subtitle}>Specific Password Test: "123456"</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Email (e.g. uzair@test.com)"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Test Trigger Button */}
      <TouchableOpacity style={styles.button} onPress={handleTestLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Run Test Case</Text>}
      </TouchableOpacity>

      {/* Live Result Log Box */}
      <View
        style={[
          styles.resultBox,
          testLog.status === 'PASS' ? styles.bgPass : testLog.status === 'FAIL' ? styles.bgFail : styles.bgIdle,
        ]}
      >
        <Text style={styles.resultTitle}>Test Execution Output:</Text>
        <Text style={styles.resultText}>{testLog.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#222' },
  subtitle: { fontSize: 13, textAlign: 'center', color: '#666', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 12 },
  button: { backgroundColor: '#007bff', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultBox: { marginTop: 25, padding: 15, borderRadius: 8, borderWidth: 1 },
  bgIdle: { backgroundColor: '#e9ecef', borderColor: '#ced4da' },
  bgPass: { backgroundColor: '#d4edda', borderColor: '#c3e6cb' },
  bgFail: { backgroundColor: '#f8d7da', borderColor: '#f5c6cb' },
  resultTitle: { fontWeight: 'bold', marginBottom: 5, color: '#333' },
  resultText: { fontSize: 14, color: '#444' },

  // Success Screen Styles
  successContainer: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f5e9' },
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 16, alignItems: 'center', elevation: 4, width: '100%' },
  welcomeEmoji: { fontSize: 50, marginBottom: 15 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', marginBottom: 10 },
  subWelcomeText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  logoutButton: { backgroundColor: '#dc3545', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  logoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});