import { redirect } from 'next/navigation';
import { getBaseWeights } from '@/actions/base-weights';
import { getWorkoutCount } from '@/actions/workout';
import { auth } from '@/api/auth';
import BaseWeightsForm from '@/components/server/base-weights-form';

const IndexPage = async () => {
    const session = await auth();
    if (!session?.idToken) redirect('/api/auth/signin');

    const baseWeights = await getBaseWeights();
    const count = (await getWorkoutCount()) ?? 0;

    if (!baseWeights && count === 0) return <BaseWeightsForm isFirstTime />;

    const cycle = Math.floor(count / 12) + 1;
    const week = Math.floor((count % 12) / 3) + 1;

    redirect(`/cycle/${cycle}/week/${week}`);
};

export default IndexPage;
