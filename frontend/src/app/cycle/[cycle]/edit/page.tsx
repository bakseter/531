'use client';

import { useParams } from 'next/navigation';
import BaseWeightsModifierForm from '@components/base-weights-modifier-form';
import { safeParseInt } from '@utils/helpers';

const CycleEditPage = () => {
    const params = useParams();
    const currentCycle = safeParseInt(params.cycle);

    if (!currentCycle) throw new Error('breh');

    return <BaseWeightsModifierForm cycle={currentCycle} />;
};

export default CycleEditPage;
