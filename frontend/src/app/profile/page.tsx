import { redirect } from 'next/navigation';
import { auth } from '@api/auth-config';
import BaseWeightsForm from '@components/server/base-weights-form';
import ProfileInputForm from '@components/client/profile-input-form';
import Button from '@components/server/button';

const ProfilePage = async () => {
    const session = await auth();

    if (!session?.user) redirect('/api/auth/signin');

    return (
        <div className="grid grid-flow-row">
            <div className="grid grid-cols-2 pt-8">
                <BaseWeightsForm />
                <div className="grid grid-flow-row justify-self-center">
                    <h3 className="font-bold">Name</h3>
                    <p className="text-lg" data-cy="profile-name">
                        {session.user.name}
                    </p>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-lg" data-cy="profile-email">
                        {session.user.email}
                    </p>
                    <p className="text-2xl font-bold">Profile</p>
                    <ProfileInputForm />
                </div>
            </div>
            <form action="/api/auth/signout" method="get">
                <Button type="submit">Sign out</Button>
            </form>
        </div>
    );
};

export default ProfilePage;
