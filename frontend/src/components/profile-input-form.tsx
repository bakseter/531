'use client';

import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '@hooks/use-profile';
import { type Profile } from '@api/workout';

interface FormValues {
    profile: Profile;
}

const RepsInputForm = () => {
    const { profile, setProfile } = useProfile();
    const { handleSubmit, register } = useForm<FormValues>({ defaultValues: { profile } });

    const id = useId();

    const onSubmit = ({ profile }: FormValues) => setProfile(profile);

    return (
        <form onChange={handleSubmit(onSubmit)}>
            <label hidden htmlFor={id}>
                Profile
            </label>
            <select className="p-1" {...register('profile', { valueAsNumber: true })}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
            </select>
        </form>
    );
};

export default RepsInputForm;
