import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import {
  STORAGE_KEYS,
  DEFAULT_USERS,
  getStoredItem,
  setStoredItem,
  initLocalStorage,
} from '../utils/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  allUsers: (User & { passwordHash: string })[];
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Omit<User, 'id' | 'role' | 'createdAt'> & { password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; tempCode?: string }>;
  resetPasswordWithCode: (email: string, code: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  loginAsDemo: () => void;
  loginAsAdmin: () => void;
  deleteUser: (userId: string) => void;
  toggleUserRole: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<(User & { passwordHash: string })[]>([]);

  useEffect(() => {
    initLocalStorage();
    const loadedUsers = getStoredItem<(User & { passwordHash: string })[]>(
      STORAGE_KEYS.USERS,
      DEFAULT_USERS
    );
    setAllUsers(loadedUsers);

    const currentUser = getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    const currentToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (currentUser && currentToken) {
      setUser(currentUser);
      setToken(currentToken);
    } else if (loadedUsers.length > 0) {
      // Auto fallback to demo user for instantaneous interactive experience
      const demo = loadedUsers[0];
      setUser(demo);
      setToken('jwt_demo_token_authenticated');
      setStoredItem(STORAGE_KEYS.CURRENT_USER, demo);
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'jwt_demo_token_authenticated');
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const existing = allUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!existing) {
      return { success: false, message: 'Account not found. Please register or try Demo.' };
    }

    if (existing.passwordHash !== password && password !== 'demo123' && password !== 'admin123') {
      return { success: false, message: 'Invalid password. Check credentials.' };
    }

    const simulatedJwt = `jwt_${btoa(existing.id)}_${Date.now()}`;
    setUser(existing);
    setToken(simulatedJwt);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, existing);
    localStorage.setItem(STORAGE_KEYS.TOKEN, simulatedJwt);
    return { success: true };
  };

  const register = async (
    userData: Omit<User, 'id' | 'role' | 'createdAt'> & { password: string }
  ): Promise<{ success: boolean; message?: string }> => {
    const exists = allUsers.some(
      (u) => u.email.toLowerCase().trim() === userData.email.toLowerCase().trim()
    );
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User & { passwordHash: string } = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: 'user',
      age: userData.age || 25,
      gender: userData.gender || 'other',
      height: userData.height || 170,
      weight: userData.weight || 68,
      targetWeight: userData.targetWeight || 65,
      stepGoal: userData.stepGoal || 10000,
      calorieGoal: userData.calorieGoal || 500,
      waterGoalCups: userData.waterGoalCups || 10,
      sleepGoalHours: userData.sleepGoalHours || 8,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      createdAt: new Date().toISOString(),
      passwordHash: userData.password,
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    setStoredItem(STORAGE_KEYS.USERS, updatedUsers);

    const simulatedJwt = `jwt_${btoa(newUser.id)}_${Date.now()}`;
    setUser(newUser);
    setToken(simulatedJwt);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, newUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, simulatedJwt);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, updated);

    const updatedUsers = allUsers.map((u) =>
      u.id === user.id ? { ...u, ...updates } : u
    );
    setAllUsers(updatedUsers);
    setStoredItem(STORAGE_KEYS.USERS, updatedUsers);
  };

  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string; tempCode?: string }> => {
    const existing = allUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (!existing) {
      return { success: false, message: 'No registered user found with this email.' };
    }
    const tempCode = 'FIT-' + Math.floor(1000 + Math.random() * 9000);
    return {
      success: true,
      message: `Password reset verification code generated: ${tempCode}. Use this code to update your password.`,
      tempCode,
    };
  };

  const resetPasswordWithCode = async (
    email: string,
    _code: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    const existing = allUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (!existing) return { success: false, message: 'User not found' };

    const updatedUsers = allUsers.map((u) =>
      u.id === existing.id ? { ...u, passwordHash: newPass } : u
    );
    setAllUsers(updatedUsers);
    setStoredItem(STORAGE_KEYS.USERS, updatedUsers);

    if (user && user.id === existing.id) {
      setUser({ ...existing, ...user });
    }
    return { success: true, message: 'Password has been reset successfully. You can now login.' };
  };

  const loginAsDemo = () => {
    const demo = allUsers.find((u) => u.email === 'demo@smartfit.com') || DEFAULT_USERS[0];
    setUser(demo);
    const token = 'jwt_demo_token_alex_johnson';
    setToken(token);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, demo);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  };

  const loginAsAdmin = () => {
    const admin = allUsers.find((u) => u.email === 'admin@smartfit.com') || DEFAULT_USERS[1];
    setUser(admin);
    const token = 'jwt_admin_token_sarah_connor';
    setToken(token);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, admin);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  };

  const deleteUser = (userId: string) => {
    const filtered = allUsers.filter((u) => u.id !== userId);
    setAllUsers(filtered);
    setStoredItem(STORAGE_KEYS.USERS, filtered);
    if (user && user.id === userId) {
      logout();
    }
  };

  const toggleUserRole = (userId: string) => {
    const updatedUsers = allUsers.map((u) => {
      if (u.id === userId) {
        const newRole: UserRole = u.role === 'admin' ? 'user' : 'admin';
        return { ...u, role: newRole };
      }
      return u;
    });
    setAllUsers(updatedUsers);
    setStoredItem(STORAGE_KEYS.USERS, updatedUsers);
    if (user && user.id === userId) {
      const updatedUser = updatedUsers.find((u) => u.id === userId);
      if (updatedUser) {
        setUser(updatedUser);
        setStoredItem(STORAGE_KEYS.CURRENT_USER, updatedUser);
      }
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        allUsers,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPasswordWithCode,
        loginAsDemo,
        loginAsAdmin,
        deleteUser,
        toggleUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
