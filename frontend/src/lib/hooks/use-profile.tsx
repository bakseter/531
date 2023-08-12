import { useState, createContext, useContext, type ReactNode } from 'react';
import { type Profile } from '@api/workout';

interface HookProps {
    profile: Profile;
    setProfile: (profile: Profile) => void;
}

const ProfileContext = createContext<HookProps>({
    profile: 1,
    setProfile: () => {},
});

const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<Profile>(1);

    return (
        <ProfileContext.Provider
            value={{
                profile,
                setProfile,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

const useProfile = (): HookProps => useContext(ProfileContext);

export default useProfile;
export { ProfileProvider };
