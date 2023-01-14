import { useForm } from 'react-hook-form';
import { Spinner, Text, Heading, Flex, Input, VStack } from '@chakra-ui/react';
import useBaseWeights from '@hooks/use-base-weights';
import { comps, exerciseToText, type CompExercise } from '@utils/helpers';
import { type BaseWeights } from '@api/base-weights';

type FormValues = BaseWeights;

interface Props {
    isFirstTime?: boolean;
}

const BaseWeightsForm = ({ isFirstTime = false }: Props) => {
    const { baseWeights, setBaseWeights, error, loading } = useBaseWeights();
    const { register, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            dl: baseWeights?.dl,
            bp: baseWeights?.bp,
            sq: baseWeights?.sq,
            op: baseWeights?.op,
        },
    });

    const onSubmit = (data: FormValues) => setBaseWeights(data);

    return (
        <VStack>
            {error && <Text>{error}</Text>}
            {loading && <Spinner />}
            {!error && !loading && (
                <Flex py={isFirstTime ? '4rem' : '0rem'}>
                    <VStack gap="2">
                        {isFirstTime && <Heading size="md">Enter base weights:</Heading>}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <VStack gap="1" alignItems="start">
                                {comps.map((value: CompExercise) => (
                                    <>
                                        <Text key={`text-${value}`} fontWeight="bold">
                                            {exerciseToText(value)}
                                        </Text>
                                        <Input
                                            type="number"
                                            step=".25"
                                            key={`input-${value}`}
                                            placeholder={exerciseToText(value)}
                                            {...register(value, { valueAsNumber: true })}
                                        />
                                    </>
                                ))}
                                <Input
                                    type="submit"
                                    value="Submit"
                                    fontWeight="bold"
                                    _hover={{ cursor: 'pointer', 'background-color': '#efefef' }}
                                />
                            </VStack>
                        </form>
                    </VStack>
                </Flex>
            )}
        </VStack>
    );
};

export default BaseWeightsForm;
