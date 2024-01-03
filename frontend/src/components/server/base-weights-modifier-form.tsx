import { redirect } from 'next/navigation';
import { auth } from '@api/auth-config';
import BaseWeightsAPI, { comps, baseWeightsModifierDecoder } from '@api/base-weights';
import { exerciseToText } from '@utils/helpers';
import { backendUrl } from '@utils/constants';
import Button from '@components/server/button';

interface Props {
    cycle: number;
}

const BaseWeightsModifierForm = async ({ cycle }: Props) => {
    const session = await auth();
    if (!session?.idToken) redirect('/api/auth/signin');

    const setBaseWeightsModifier = async (formData: FormData) => {
        'use server';

        const rawBaseWeightsMod = {
            dl: formData.get('dl'),
            bp: formData.get('bp'),
            sq: formData.get('sq'),
            op: formData.get('op'),
            cycle,
        };

        const baseWeightsMod = baseWeightsModifierDecoder(rawBaseWeightsMod);

        const { status } = await fetch(`${backendUrl}/base-weights/modifier?profile=1`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.idToken}` },
            body: JSON.stringify(baseWeightsMod),
        });

        if (status !== 200 && status !== 202) throw new Error(`something went wrong: ${status}`);
    };

    const baseWeightsMod = await BaseWeightsAPI.getBaseWeightsModifier({ idToken: session.idToken, profile: 1, cycle });
    const baseWeights = await BaseWeightsAPI.getBaseWeights({ idToken: session.idToken, profile: 1 });
    const baseWeightsForCycle = await BaseWeightsAPI.getBaseWeightsForCycle({
        idToken: session.idToken,
        profile: 1,
        baseWeights,
        cycle,
    });

    return (
        <form action={setBaseWeightsModifier}>
            {comps.map((exercise) => (
                <div className="m-8" key={`bm-mod-select-${exercise}`}>
                    <h4 className="my-2 font-bold">{exerciseToText(exercise)}</h4>
                    <div className="grid grid-cols-2 gap-5">
                        <select className="text-center p-1" name={exercise} defaultValue={baseWeightsMod?.[exercise]}>
                            <option value={0}>+ 0 kg</option>
                            {[1, 2, 3, 4, 5].map((_, index) => (
                                <option key={`bm-mod-select-${exercise}-option-${index}`} value={index + 1}>
                                    + {2.5 * (index + 1)} kg
                                </option>
                            ))}
                        </select>
                        <p>
                            {'= '}
                            {baseWeightsForCycle[exercise]} kg
                        </p>
                    </div>
                </div>
            ))}
            <Button type="submit">Submit</Button>
        </form>
    );
};

export default BaseWeightsModifierForm;
