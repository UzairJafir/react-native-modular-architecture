import { useState, useEffect } from 'react';
import { getUserProfileService } from '../services/userService';

export const useUser = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    getUserProfileService().then((res) => {
      if (isMounted) {
        setUserData(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return { userData, loading };
};