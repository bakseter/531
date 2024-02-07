'use client';

import { useEffect } from 'react';
import { backendUrl } from '@/utils/constants';

interface PingerProps {
    intervalSeconds?: number;
}

const Pinger = ({ intervalSeconds = 60 }: PingerProps) => {
    useEffect(() => {
        const interval = setInterval(() => fetch(`${backendUrl}/status`), intervalSeconds * 1000);
        return () => void clearInterval(interval);
    }, [intervalSeconds]);

    return null;
};

export default Pinger;
