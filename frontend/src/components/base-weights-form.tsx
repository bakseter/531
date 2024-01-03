'use client';

import { useId } from 'react';
import { useForm, useFormContext, FormProvider } from 'react-hook-form';
import { useBaseWeights } from '@hooks/use-base-weights';
import { exerciseToText } from '@utils/helpers';
import { defaultClassNames } from '@components/button';
import Spinner from '@components/spinner';
import { type CompExercise, comps, type BaseWeights } from '@api/base-weights';

type FormValues = BaseWeights;

interface Props {
    isFirstTime?: boolean;
}

const BaseWeightsForm = ({ isFirstTime = false }: Props) => {
    const { baseWeights, setBaseWeights, error, loading } = useBaseWeights();

    const methods = useForm<FormValues>({
        defaultValues: {
            dl: baseWeights?.dl,
            bp: baseWeights?.bp,
            sq: baseWeights?.sq,
            op: baseWeights?.op,
        },
    });

    const onSubmit = (data: FormValues) => setBaseWeights(data);

    return (
        <FormProvider {...methods}>
            <div className="grid grid-cols-1">
                {error && <p>{error}</p>}
                {loading && <Spinner />}
                {!error && !loading && (
                    <div className={`flex mx-auto ${isFirstTime ? 'py-8' : ''}`}>
                        <div className="grid grid-cols-1 gap-2">
                            {isFirstTime && <h3 className="text-center">Please enter your base weights below 👇</h3>}
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 gap-1 align-items-start">
                                    {comps.map((comp: CompExercise, index) => (
                                        <BaseWeightsFormInput comp={comp} key={`${comp}-${index}`} />
                                    ))}
                                    <input
                                        className={`${defaultClassNames} cursor-pointer`}
                                        type="submit"
                                        value="Submit"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </FormProvider>
    );
};

interface BaseWeightsFormInputProps {
    comp: CompExercise;
}

const BaseWeightsFormInput = ({ comp }: BaseWeightsFormInputProps) => {
    const id = useId();

    const { register } = useFormContext();

    return (
        <>
            <label htmlFor={id} className="text-2xl font-bold py-2">
                {exerciseToText(comp)}
            </label>
            <input
                id={id}
                type="number"
                step=".25"
                key={`input-${comp}`}
                placeholder={exerciseToText(comp)}
                className="border-2 border-gray-300 rounded-md p-2"
                {...register(comp, { valueAsNumber: true })}
            />
        </>
    );
};

export default BaseWeightsForm;
