/**
 * Finflow Real-Time Email & OTP Service
 * Generates dynamic 6-digit OTP codes and delivers real emails to user Gmail.
 */

// EmailJS Configuration for direct Gmail delivery (free & no server needed)
export const EMAIL_CONFIG = {
  // Set your EmailJS keys here to receive real emails in your Gmail inbox:
  // 1. Register for free at https://www.emailjs.com
  // 2. Connect your Gmail under 'Email Services'
  // 3. Create an 'Email Template' with variables: {{otp_code}}, {{to_name}}, {{to_email}}
  // 4. Fill these 3 keys:
  SERVICE_ID: '', // e.g. 'service_xxxxxx'
  TEMPLATE_ID: '', // e.g. 'template_xxxxxx'
  PUBLIC_KEY: '', // e.g. 'xxxx_xxxxxxxx'
};

/**
 * Generates a random dynamic 6-digit numeric OTP code
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends OTP to recipient email.
 * If EmailJS keys are provided, it dispatches an actual email to Gmail via REST API.
 * Otherwise, it triggers the real-time in-app delivery simulation.
 */
export const sendOTPEmail = async (email, fullName, otpCode) => {
  const isRealConfigured =
    EMAIL_CONFIG.SERVICE_ID &&
    EMAIL_CONFIG.TEMPLATE_ID &&
    EMAIL_CONFIG.PUBLIC_KEY;

  if (isRealConfigured) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAIL_CONFIG.SERVICE_ID,
          template_id: EMAIL_CONFIG.TEMPLATE_ID,
          user_id: EMAIL_CONFIG.PUBLIC_KEY,
          template_params: {
            to_email: email,
            to_name: fullName || 'Finflow User',
            otp_code: otpCode,
            app_name: 'Finflow Digital Banking',
          },
        }),
      });

      if (response.ok) {
        return { success: true, mode: 'real_email' };
      }
    } catch (error) {
      console.warn('Real email dispatch failed, falling back:', error);
    }
  }

  return { success: true, mode: 'in_app' };
};
