import { redirect } from 'next/navigation';
import BaseWeightsAPI, { type CompExercise, comps, baseWeightsDecoder } from '@api/base-weights';
import BaseWeightsFormInput from '@components/client/base-weights-form-input';
import { auth } from '@api/auth-config';
import { backendUrl } from '@utils/constants';
import Button from '@components/server/button';

interface Props {
    isFirstTime?: boolean;
}

const BaseWeightsForm = async ({ isFirstTime = false }: Props) => {
    const session = await auth();
    if (!session?.idToken) redirect('/api/auth/signin');

    const setBaseWeights = async (formData: FormData) => {
        'use server';

        const rawBaseWeights = {
            dl: formData.get('dl'),
            bp: formData.get('bp'),
            sq: formData.get('sq'),
            op: formData.get('op'),
        };

        const baseWeights = baseWeightsDecoder(rawBaseWeights);

        const { status } = await fetch(`${backendUrl}/base-weights?profile=1`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.idToken}` },
            body: JSON.stringify(baseWeights),
        });

        if (status !== 200 && status !== 202) throw new Error(`something went wrong: ${status}`);

        if (isFirstTime) redirect('/cycle/1/week/1');
    };

    const baseWeights = await BaseWeightsAPI.getBaseWeights({ idToken: session.idToken, profile: 1 });

    return (
        <div className="grid grid-cols-1">
            <div className={`flex mx-auto ${isFirstTime ? 'py-8' : ''}`}>
                <div className="grid grid-cols-1 gap-2">
                    {isFirstTime && <h3 className="text-center">Please enter your base weights below 👇</h3>}
                    <form action={setBaseWeights}>
                        <div className="grid grid-cols-1 gap-1 align-items-start">
                            {comps.map((comp: CompExercise, index) => (
                                <BaseWeightsFormInput
                                    comp={comp}
                                    key={`${comp}-${index}`}
                                    initialValue={baseWeights?.[comp]}
                                />
                            ))}
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BaseWeightsForm;
