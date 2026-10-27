import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  clearError: () => {},
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    // 1. Restore active session on initial mount / page refresh
    const getInitialSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('[Supabase Auth] Session fetch error:', sessionError.message);
        }
        if (mounted) {
          setSession(data?.session || null);
          setUser(data?.session?.user || null);
        }
      } catch (err) {
        console.error('[Supabase Auth] Unexpected error fetching session:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // 2. Listen to ongoing auth state changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (mounted) {
        setSession(newSession || null);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const clearError = () => setError(null);

  const signUp = async (email, password) => {
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        return { data: null, error: signUpError };
      }
      return { data, error: null };
    } catch (err) {
      const msg = err.message || 'An unexpected sign-up error occurred';
      setError(msg);
      return { data: null, error: { message: msg } };
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return { data: null, error: signInError };
      }
      return { data, error: null };
    } catch (err) {
      const msg = err.message || 'An unexpected sign-in error occurred';
      setError(msg);
      return { data: null, error: { message: msg } };
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
        return { error: signOutError };
      }
      setSession(null);
      setUser(null);
      return { error: null };
    } catch (err) {
      const msg = err.message || 'An unexpected sign-out error occurred';
      setError(msg);
      return { error: { message: msg } };
    }
  };

  const resendConfirmation = async (email) => {
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });
      if (resendError) {
        return { error: resendError };
      }
      return { error: null };
    } catch (err) {
      return { error: { message: err.message || 'Failed to resend confirmation email.' } };
    }
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      error,
      signUp,
      signIn,
      signOut,
      resendConfirmation,
      clearError,
    }),
    [user, session, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
