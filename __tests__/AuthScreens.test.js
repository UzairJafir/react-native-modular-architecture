import React from 'react';
import { Alert } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import SplashScreen from '../src/screens/auth/SplashScreen';
import LoginScreen from '../src/screens/auth/LoginScreen';
import SignupScreen from '../src/screens/auth/SignupScreen';
import OTPScreen from '../src/screens/auth/OTPScreen';
import AppButton from '../src/components/common/AppButton';
import AppInput from '../src/components/common/AppInput';

describe('Day 1 Auth Screens Flow & Unit Tests', () => {
  // Test 1: SplashScreen
  it('Verify SplashScreen renders correctly and updates state/navigation timeout', () => {
    jest.useFakeTimers();
    const mockNavigation = { replace: jest.fn(), navigate: jest.fn() };
    let tree;

    act(() => {
      tree = renderer.create(<SplashScreen navigation={mockNavigation} />);
    });

    expect(tree.toJSON()).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigation.replace).toHaveBeenCalledWith('Login');
    jest.useRealTimers();
  });

  // Test 2: LoginScreen
  it('Verify LoginScreen input validation shows error on empty email/password', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const mockNavigation = { navigate: jest.fn() };
    let tree;

    act(() => {
      tree = renderer.create(<LoginScreen navigation={mockNavigation} />);
    });

    const button = tree.root.findByType(AppButton);

    act(() => {
      button.props.onPress();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Validation Error',
      'Please enter both email and password.'
    );
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  // Test 3: SignupScreen
  it('Verify SignupScreen validates matching passwords before navigating to OTP', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const mockNavigation = { navigate: jest.fn() };
    let tree;

    act(() => {
      tree = renderer.create(<SignupScreen navigation={mockNavigation} />);
    });

    const inputs = tree.root.findAllByType(AppInput);
    const button = tree.root.findByType(AppButton);

    // Enter mismatching passwords
    act(() => {
      inputs[0].props.onChangeText('Jane Doe');
      inputs[1].props.onChangeText('jane@example.com');
      inputs[2].props.onChangeText('secret123');
      inputs[3].props.onChangeText('different456');
    });

    await act(async () => {
      await button.props.onPress();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Validation Error',
      'Passwords do not match.'
    );
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    // Fix confirmPassword to match password
    act(() => {
      inputs[3].props.onChangeText('secret123');
    });

    await act(async () => {
      await button.props.onPress();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'OTP Sent',
      expect.stringContaining('jane@example.com'),
      expect.any(Array)
    );

    alertSpy.mockRestore();
  });

  // Test 4: OTPScreen
  it('Verify OTPScreen successfully validates 6-digit input', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const mockNavigation = { navigate: jest.fn() };
    const mockRoute = {
      params: {
        email: 'user@finflow.app',
        fullName: 'Test User',
        generatedOtp: '123456',
      },
    };
    let tree;

    act(() => {
      tree = renderer.create(
        <OTPScreen route={mockRoute} navigation={mockNavigation} />
      );
    });

    const input = tree.root.findByType(AppInput);
    const button = tree.root.findByType(AppButton);

    // 1. Incomplete / short OTP
    act(() => {
      input.props.onChangeText('123');
    });

    act(() => {
      button.props.onPress();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Validation Error',
      'Please enter a valid 6-digit OTP code.'
    );

    // 2. Correct 6-digit OTP code
    act(() => {
      input.props.onChangeText('123456');
    });

    act(() => {
      button.props.onPress();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Verification Successful! 🎉',
      expect.stringContaining('Welcome to Finflow!'),
      expect.any(Array)
    );

    alertSpy.mockRestore();
  });
});
