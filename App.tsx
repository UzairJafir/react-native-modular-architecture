import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { HomeScreen } from './src/pages/HomeScreen';

function App(): React.JSX.Element {
  return (
    <AppProvider>
      <SafeAreaView style={styles.container}>
        <HomeScreen />
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
});

export default App;