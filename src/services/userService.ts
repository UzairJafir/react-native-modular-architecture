import { loginApiCall } from '../api/authApi';

export const handleLoginService = async (email: string, pass: string) => {
  const res: any = await loginApiCall(email, pass);

  if (res.status === 200) {
    return { success: true, token: res.data.token, user: res.data.email };
  }
  return { success: false, message: res.message };
};