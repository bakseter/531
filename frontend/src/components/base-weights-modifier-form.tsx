'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSession, signOut } from 'next-auth/react';
import BaseWeightsAPI, { type BaseWeights, comps } from '@api/base-weights';
import { exerciseToText } from '@utils/helpers';
import { useBaseWeights } from '@hooks/use-base-weights';
import { useProfile } from '@hooks/use-profile';

interface Props {
    cycle: number;
}

type FormValues = BaseWeights;

const BaseWeightsModifierForm = ({ cycle }: Props) => {
    const [, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { profile } = useProfile();

    const { baseWeightsForCycle, setBaseWeightsModifier } = useBaseWeights();

    const { handleSubmit, register, setValue } = useForm<FormValues>();

    const { data: session } = useSession();

    const router = useRouter();

    const onSubmit = async (mod: FormValues) => {
        await setBaseWeightsModifier({ ...mod, cycle });
        router.refresh();
    };

    useEffect(() => {
        const fetchWorkout = async () => {
            if (!session?.idToken) return;

            setLoading(true);
            setError(null);

            try {
                const result = await BaseWeightsAPI.getBaseWeightsModifier({
                    idToken: session.idToken,
                    profile,
                    cycle,
                });

                setLoading(false);

                if (result === null) {
                    setError('could not get base weights modifier');
                    return;
                }

                if (result === true) {
                    setError(null);
                    return;
                }

                if (result === false) {
                    await signOut();
                    return;
                }

                setValue('dl', result.dl);
                setValue('bp', result.bp);
                setValue('sq', result.sq);
                setValue('op', result.op);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setError(JSON.stringify(error));
            }
        };
        void fetchWorkout();
    }, [session?.idToken, cycle, setValue, profile]);

    return (
        <>
            <form onChange={handleSubmit(onSubmit)}>
                {comps.map((exercise) => (
                    <div className="m-8" key={`bm-mod-select-${exercise}`}>
                        <h4 className="my-2 font-bold">{exerciseToText(exercise)}</h4>
                        <div className="grid grid-cols-2 gap-5">
                            <select className="text-center p-1" {...register(exercise, { valueAsNumber: true })}>
                                <option value={0}>+ 0 kg</option>
                                {[1, 2, 3, 4, 5].map((_, index) => (
                                    <option key={`select-option-${index}`} value={index + 1}>
                                        + {2.5 * (index + 1)} kg
                                    </option>
                                ))}
                            </select>
                            {baseWeightsForCycle && (
                                <p>
                                    {'= '}
                                    {baseWeightsForCycle.find((bw) => bw.cycle === cycle)?.baseWeights[exercise]} kg
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </form>
            {error && <p>🚨</p>}
        </>
    );
};

export default BaseWeightsModifierForm;
