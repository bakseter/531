import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Text, Heading, StackItem, Stack, Center, SimpleGrid, GridItem, SkeletonText, Select } from '@chakra-ui/react';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { useSession, signOut } from 'next-auth/react';
import BaseWeightsAPI, { type BaseWeights, comps } from '@api/base-weights';
import { exerciseToText } from '@utils/helpers';
import useBaseWeights from '@hooks/use-base-weights';

interface Props {
    cycle: number;
}

type FormValues = BaseWeights;

const BaseWeightsModifierForm = ({ cycle }: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { baseWeightsForCycle, setBaseWeightsModifier } = useBaseWeights();

    const { handleSubmit, register, setValue } = useForm<FormValues>();

    const { data: session } = useSession();

    const router = useRouter();

    const onSubmit = async (mod: FormValues) => {
        await setBaseWeightsModifier({ ...mod, cycle });
        router.reload();
    };

    useEffect(() => {
        const fetchWorkout = async () => {
            if (!session?.idToken) return;

            setLoading(true);
            setError(null);

            try {
                const result = await BaseWeightsAPI.getBaseWeightsModifier({ idToken: session.idToken, cycle });

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
    }, [session?.idToken, cycle, setValue]);

    return (
        <SimpleGrid columns={4}>
            <GridItem colSpan={3}>
                <SkeletonText isLoaded={!loading} noOfLines={2}>
                    <form onChange={handleSubmit(onSubmit)}>
                        <Stack direction="column" gap={2}>
                            {comps.map((exercise) => (
                                <StackItem key={`bm-mod-select-${exercise}`} w="80%">
                                    <Heading size="sm" my="0.8rem">
                                        {exerciseToText(exercise)}
                                    </Heading>
                                    <SimpleGrid columns={2} gap={5}>
                                        <Select
                                            size={['xs', null, 'md']}
                                            {...register(exercise, { valueAsNumber: true })}
                                            w="100%"
                                        >
                                            <option value={0}>+0 kg</option>
                                            {[1, 2, 3, 4, 5].map((_, index) => (
                                                <option key={`select-option-${index}`} value={index + 1}>
                                                    +{2.5 * (index + 1)} kg
                                                </option>
                                            ))}
                                        </Select>
                                        {baseWeightsForCycle && (
                                            <Text>
                                                {
                                                    baseWeightsForCycle.find((bw) => bw.cycle === cycle)?.baseWeights[
                                                        exercise
                                                    ]
                                                }{' '}
                                                kg
                                            </Text>
                                        )}
                                    </SimpleGrid>
                                </StackItem>
                            ))}
                        </Stack>
                    </form>
                </SkeletonText>
            </GridItem>
            {error && (
                <Center>
                    <AiFillExclamationCircle color="red" size="2rem" />
                </Center>
            )}
        </SimpleGrid>
    );
};

export default BaseWeightsModifierForm;
