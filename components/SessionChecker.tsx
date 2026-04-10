'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

/**
 * Detects if the current user was deleted from the database.
 * When detected, automatically signs them out and redirects to /login.
 * Rendered once in the root layout — works globally across all pages.
 */
export default function SessionChecker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      const user = session?.user as any;
      if (user?.deleted) {
        signOut({ callbackUrl: '/login' });
      } else if (user?.isBanned) {
        signOut({ callbackUrl: '/login?error=BAN_ACTIVE' });
      }
    }
  }, [session, status]);

  return null; // Renders nothing — side-effect only
}
