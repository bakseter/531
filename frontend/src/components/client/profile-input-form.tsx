'use client';

import { useId } from 'react';

const ProfileInputForm = () => {
    const profile = 1;
    const id = useId();

    return (
        <form>
            <label hidden htmlFor={id}>
                Profile
            </label>
            <select className="p-1" name="profile" defaultValue={profile}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
            </select>
        </form>
    );
};

export default ProfileInputForm;
