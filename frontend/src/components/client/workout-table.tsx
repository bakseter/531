'use client';

import { useState, Fragment } from 'react';
import { weekToSetsReps, percentageToText, weekToPercentages, dayToExercise, weekToDefiningRep } from '@utils/helpers';
import { type Week, type Day } from '@api/workout';
import type { BaseWeights } from '@api/base-weights';
import JokerInput from '@components/client/joker-input';
import RepsInput from '@components/client/reps-input';
import Button from '@components/server/button';

const indexToHeading = (i: number): string | undefined => {
    if (i === 0) return 'Warmup';
    if (i === 3) return 'Main sets';
    if (i === 6) return 'Joker sets';
};

interface Props {
    cycle: number;
    week: Week;
    day: Day;
    baseWeightsForCycle: BaseWeights;
    initialJokerAmount?: number;
}

const WorkoutTable = ({ cycle, week, day, baseWeightsForCycle, initialJokerAmount = 0 }: Props) => {
    const jokerCutoff = 5;
    const warmupCutoff = 2;

    const reps = (index: number): number | undefined => weekToSetsReps(week)[index] ?? weekToDefiningRep(week);
    const roundToNearest = (index: number) => (index <= warmupCutoff ? 5 : 2.5);

    const [jokerAmount, setJokerAmount] = useState<number>(initialJokerAmount);

    const tableRowStyle = 'p-2';
    const tableRowStyleAlt = `${tableRowStyle} bg-slate-200`;

    const RepsField = ({ index }: { index: number }) => {
        if (index === jokerCutoff) return <RepsInput cycle={cycle} week={week} day={day} />;

        if (index > jokerCutoff) return <JokerInput cycle={cycle} week={week} day={day} num={index - jokerCutoff} />;

        return '-';
    };

    return (
        <>
            <table className="border-collapse border-spacing-2 border border-slate-400 table-auto">
                <thead>
                    <tr className="border border-slate-400">
                        <th className={tableRowStyle}>Sets</th>
                        <th className={tableRowStyle}>Percent</th>
                        <th className={tableRowStyle}>Weight</th>
                        <th className={tableRowStyle}>Actual</th>
                    </tr>
                </thead>
                <tbody>
                    {weekToPercentages(week, jokerAmount).map((percentage, index) => {
                        const headingText: string | undefined = indexToHeading(index);

                        return (
                            <Fragment key={`week-to-percentages-${percentage}-${index}`}>
                                {index % 3 === 0 && index <= 6 && headingText && (
                                    <tr className="px-2 py-4 pt-8 font-bold">
                                        <td>{headingText}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td className={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>
                                        {`1x${reps(index) ?? weekToDefiningRep(week)}${index === 5 ? '+' : ''}`}
                                    </td>
                                    <td className={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>
                                        {percentageToText(percentage)}
                                    </td>
                                    <td className={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>
                                        {`${Math.max(
                                            20,
                                            roundToNearest(index) *
                                                Math.ceil(
                                                    (baseWeightsForCycle[dayToExercise(day)] * percentage) /
                                                        roundToNearest(index),
                                                ),
                                        )} kg`}
                                    </td>
                                    <td className={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>
                                        <RepsField index={index} />
                                    </td>
                                </tr>
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
            <Button className="mx-auto" onClick={() => setJokerAmount((value) => value + 1)}>
                Add joker set
            </Button>
        </>
    );
};

export default WorkoutTable;
