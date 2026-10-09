import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigation?.replace) {
        navigation.replace('Login');
      } else if (navigation?.navigate) {
        navigation.navigate('Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finflow</Text>
      <Text style={styles.subtitle}>Smart Banking, Simplified.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.background,
    marginTop: 10,
    opacity: 0.9,
  },
});

export default SplashScreen;
