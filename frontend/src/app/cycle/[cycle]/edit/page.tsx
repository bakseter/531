import BaseWeightsModifierForm from '@/components/server/base-weights-modifier-form';
import { intCoerciveDecoder } from '@/utils/helpers';

interface Props {
    params: {
        cycle: string;
    };
}

const CycleEditPage = ({ params }: Props) => {
    const currentCycle = intCoerciveDecoder(params.cycle);

    if (!currentCycle) throw new Error("Invalid cycle '${currentCycle}'");

    return <BaseWeightsModifierForm cycle={currentCycle} />;
};

export default CycleEditPage;
