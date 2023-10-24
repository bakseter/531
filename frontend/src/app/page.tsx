'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useBaseWeights } from '@hooks/use-base-weights';
import BaseWeightsForm from '@components/base-weights-form';

const IndexPage = () => {
    const { baseWeights } = useBaseWeights();
    const { status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') void signIn();
    }, [status]);

    if (baseWeights) redirect('/cycle/1/week/1');

    return <BaseWeightsForm isFirstTime />;
};

export default IndexPage;
