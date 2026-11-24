'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'guest' | 'tenant' | 'dev_freelance' | 'admin_owner' | 'super_admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  tenantId?: string | null;
  websiteDomain?: string | null;
  websiteName?: string | null;
  subRoles?: string[];
  createdAt?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsMock: (role: UserRole) => Promise<void>;
  logout: () => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  authHeaders: () => Record<string, string>;
  updateUser: (partial: Partial<UserProfile>) => void;
}

export const MOCK_USERS: Record<UserRole, UserProfile> = {
  super_admin: {
    id: 'u-super-001',
    email: 'superadmin@marketplace.vn',
    fullName: 'Nguyễn Hoàng Kim',
    role: 'super_admin',
    tenantId: null,
    websiteDomain: null,
    websiteName: 'Toàn sàn Phố Nghề',
    subRoles: ['all_access'],
    createdAt: '2026-01-01T00:00:00Z',
  },
  admin_owner: {
    id: 'u-owner-002',
    email: 'owner@phohanoi.vn',
    fullName: 'Trần Văn An',
    role: 'admin_owner',
    tenantId: 'tenant-pho-01',
    websiteDomain: 'phohanoi.vn',
    websiteName: 'Nhà hàng Phở Hà Nội',
    subRoles: ['editor', 'order_manager', 'cashier'],
    createdAt: '2026-02-15T00:00:00Z',
  },
  tenant: {
    id: 'u-tenant-003',
    email: 'tenant@caferang.vn',
    fullName: 'Lê Thị Bích',
    role: 'tenant',
    tenantId: 'tenant-cafe-02',
    websiteDomain: null,
    websiteName: 'Chuỗi Café Rang Mộc',
    subRoles: [],
    createdAt: '2026-03-10T00:00:00Z',
  },
  dev_freelance: {
    id: 'u-dev-004',
    email: 'dev@freelance.vn',
    fullName: 'Phạm Minh Tuấn',
    role: 'dev_freelance',
    tenantId: null,
    websiteDomain: null,
    subRoles: ['seller', 'developer'],
    createdAt: '2026-02-01T00:00:00Z',
  },
  guest: {
    id: 'u-guest-005',
    email: 'guest@example.com',
    fullName: 'Khách Vãng Lai',
    role: 'guest',
    tenantId: null,
    websiteDomain: null,
    subRoles: [],
    createdAt: '2026-03-20T00:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'wm_auth_token';
const USER_KEY = 'wm_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Default to super_admin during admin testing if nothing stored
        const defaultMock = MOCK_USERS.super_admin;
        setToken('mock-jwt-token-super_admin');
        setUser(defaultMock);
        localStorage.setItem(TOKEN_KEY, 'mock-jwt-token-super_admin');
        localStorage.setItem(USER_KEY, JSON.stringify(defaultMock));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // 1. Try real NestJS backend endpoint
      const res = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const accessToken = data.accessToken || data.token || 'real-jwt-token';
        const userProfile = data.user || {
          id: data.id || 'u-real',
          email,
          fullName: data.fullName || email.split('@')[0],
          role: data.role || 'tenant',
          tenantId: data.tenantId,
          websiteDomain: data.websiteDomain,
          subRoles: data.subRoles || [],
        };

        setToken(accessToken);
        setUser(userProfile);
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
        return { success: true };
      }
    } catch {
      // Backend not running or connection refused, fallback to mock check
    }

    // 2. Fallback to mock account search
    const cleanEmail = email.trim().toLowerCase();
    const matchedRole = (Object.keys(MOCK_USERS) as UserRole[]).find(
      (r) => MOCK_USERS[r].email.toLowerCase() === cleanEmail
    );

    if (matchedRole) {
      const mockUser = MOCK_USERS[matchedRole];
      const mockToken = `mock-jwt-token-${matchedRole}`;
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      setIsLoading(false);
      return { success: true };
    }

    // Generic fallback for any email entered
    const genericUser: UserProfile = {
      id: `u-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      role: 'tenant',
      tenantId: null,
      subRoles: [],
    };
    const genToken = `mock-jwt-${Date.now()}`;
    setToken(genToken);
    setUser(genericUser);
    localStorage.setItem(TOKEN_KEY, genToken);
    localStorage.setItem(USER_KEY, JSON.stringify(genericUser));
    setIsLoading(false);
    return { success: true };
  }, []);

  const loginAsMock = useCallback(async (role: UserRole) => {
    setIsLoading(true);
    const mockUser = MOCK_USERS[role];
    const mockToken = `mock-jwt-token-${role}`;
    setToken(mockToken);
    setUser(mockUser);
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    try {
      fetch('http://localhost:3001/api/v1/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const hasRole = useCallback(
    (allowedRoles: UserRole[]): boolean => {
      if (!user) return false;
      return allowedRoles.includes(user.role);
    },
    [user]
  );

  const authHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  const updateUser = useCallback((partial: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partial };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        loginAsMock,
        logout,
        hasRole,
        authHeaders,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
