'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import BaseWeightsForm from '@components/base-weights-form';
import ProfileInputForm from '@components/profile-input-form';
import Button from '@components/button';

const ProfilePage = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') void signIn();
    }, [status]);

    return (
        <div className="grid grid-flow-row">
            <div className="grid grid-cols-2 pt-8">
                <BaseWeightsForm />
                <div className="grid grid-flow-row justify-self-center">
                    {session?.user && (
                        <>
                            <h3 className="font-bold">Name</h3>
                            <p className="text-lg">{session.user.name}</p>
                            <h3 className="font-bold">Email</h3>
                            <p className="text-lg">{session.user.email}</p>
                        </>
                    )}
                    <p className="text-2xl font-bold">Profile</p>
                    <ProfileInputForm />
                </div>
            </div>
            <Button className="justify-self-center my-8" onClick={() => void signOut()}>
                Sign out
            </Button>
        </div>
    );
};

export default ProfilePage;
