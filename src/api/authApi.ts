// Login API Simulation
export const loginApiCall = async (email: string, pass: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Database Check: Specific Password test
      if (pass === '123456') {
        resolve({
          status: 200,
          data: { token: 'auth_token_abc_123', email },
        });
      } else {
        resolve({
          status: 401,
          message: 'Incorrect Password!',
        });
      }
    }, 1000);
  });
};