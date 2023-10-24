'use client';

import type { ReactNode } from 'react';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

interface SessionProviderWrapperProps {
    children: ReactNode;
    session?: Session;
}

const SessionProviderWrapper = ({ children, session }: SessionProviderWrapperProps) => {
    return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
