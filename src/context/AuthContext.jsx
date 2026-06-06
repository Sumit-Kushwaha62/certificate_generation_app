import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      })
      .catch((err) => {
        console.error('Supabase auth error:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => {
        if (subscription) subscription.unsubscribe();
      };
    }
  }, []);

  const signUp = (email, password) => supabase?.auth.signUp({ email, password });
  const signIn = (email, password) => supabase?.auth.signInWithPassword({ email, password });
  const signOut = () => supabase?.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);