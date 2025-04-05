'use client';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string[];
  accessToken: string;
  refreshToken: string;
} | null;

type AuthResult = {
  user: User;
  status: string;
};

export default function useAuthClient() {
  const { data: session, status, update } = useSession({ required: false });
  const resultRef = useRef<AuthResult>({ user: null, status: 'loading' });

  // Memoize the result to prevent unnecessary re-renders
  const result = useMemo(() => {
    const newUser = session?.user as User || null;
    return { user: newUser, status };
  }, [session?.user, status]);

  // Update ref for stability
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  return resultRef.current;
}