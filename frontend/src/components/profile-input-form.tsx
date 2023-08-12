import { GridItem, SimpleGrid, Select } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import useProfile from '@hooks/use-profile';
import { type Profile } from '@api/workout';

interface FormValues {
    profile: Profile;
}

const RepsInputForm = () => {
    const { profile, setProfile } = useProfile();
    const { handleSubmit, register } = useForm<FormValues>({ defaultValues: { profile } });

    const onSubmit = ({ profile }: FormValues) => setProfile(profile);

    return (
        <SimpleGrid columns={4}>
            <GridItem colSpan={3} justifySelf="center">
                <form onChange={handleSubmit(onSubmit)}>
                    <Select size={['xs', null, 'md']} {...register('profile', { valueAsNumber: true })} w="100%">
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </Select>
                </form>
            </GridItem>
        </SimpleGrid>
    );
};

export default RepsInputForm;
