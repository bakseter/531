import { redirect } from 'next/navigation';
import BaseWeightsForm from '@components/base-weights-form';
import BaseWeightsAPI from '@api/base-weights';
import WorkoutAPI from '@api/workout';
import { auth } from '@api/auth-config';

const IndexPage = async () => {
    const session = await auth();
    if (!session?.idToken) redirect('/api/auth/signin');

    const baseWeights = await BaseWeightsAPI.getBaseWeights({ idToken: session.idToken, profile: 1 });
    const count = (await WorkoutAPI.getWorkoutCount({ idToken: session.idToken, profile: 1 })) ?? 0;

    if (!baseWeights && count === 0) return <BaseWeightsForm isFirstTime />;

    const cycle = Math.floor(count / 12) + 1;
    const week = Math.floor((count % 12) / 3) + 1;

    redirect(`/cycle/${cycle}/week/${week}`);
};

export default IndexPage;
