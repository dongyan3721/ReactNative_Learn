import {User} from "@/types";

import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
  setToken: async (token: string) => {
    await AsyncStorage.setItem('token', token);
  },
  getToken: async () => {
    return await AsyncStorage.getItem('token');
  },
  removeToken: async () => {
    await AsyncStorage.removeItem('token');
  },
  setUser: async (user: User) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },
  getUser: async (): Promise<User | null> => {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  removeUser: async () => {
    await AsyncStorage.removeItem('user');
  },
  clear: async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  },
};

export default storage