'use client';

import { useState } from 'react';
import JokerInput from '@components/joker-input';
import RepsInputForm from '@components/reps-input-form';
import Spinner from '@components/spinner';
import { type Week, type Day } from '@api/workout';
import {
    weekToSetsReps,
    percentageToText,
    exerciseToText,
    weekToPercentages,
    dayToExercise,
    weekToDefiningRep,
} from '@utils/helpers';
import Button from '@components/button';
import DateBoxForm from '@components/date-box-form';
import { useBaseWeights } from '@hooks/use-base-weights';

const indexToHeading = (i: number): string | undefined => {
    if (i === 0) return 'Warmup';
    if (i === 3) return 'Main sets';
    if (i === 6) return 'Joker sets';
};

interface Props {
    cycle: number;
    week: Week;
    day: Day;
}

const Workout = ({ cycle, week, day }: Props) => {
    const warmupCutoff = 2;
    const jokerCutoff = 5;
    const reps = (index: number): number | undefined => weekToSetsReps(week)[index];
    const roundToNearest = (index: number) => (index <= warmupCutoff ? 5 : 2.5);
    const [jokersWeightAdd, setJokersWeightAdd] = useState<number | undefined>();

    const { baseWeightsForCycle } = useBaseWeights();

    const handleClick = () => {
        setJokersWeightAdd((value) => (value === undefined ? 1 : value + 1));
    };

    const tableRowStyle = 'p-2';
    const tableRowStyleAlt = `${tableRowStyle} bg-slate-200`;

    const repsField = ({ index, percentage }: { index: number; percentage: number }) => {
        if (index === jokerCutoff) {
            return <RepsInputForm key={`reps-input-${cycle}-${week}-${day}`} cycle={cycle} week={week} day={day} />;
        }

        if (index > jokerCutoff) {
            return (
                <JokerInput
                    key={`joker-input-${cycle}-${week}-${day}-${index}-${percentage}`}
                    cycle={cycle}
                    week={week}
                    day={day}
                    num={index - jokerCutoff}
                />
            );
        }

        return <p key={`n/a-${percentage}-${index}`}>–</p>;
    };

    const baseWeights = baseWeightsForCycle?.find((bw) => bw.cycle === cycle)?.baseWeights;

    if (!baseWeights) return <Spinner />;

    return (
        <>
            <div className="grid grid-flow-col items-center">
                <h3 className="font-bold my-2 inline">{exerciseToText(dayToExercise(day))}</h3>
                <div className="my-2">
                    <DateBoxForm cycle={cycle} week={week} day={day} />
                </div>
            </div>
            <div className="grid grid-cols-1 items-center">
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
                        {weekToPercentages(week, jokersWeightAdd).map((percentage, index) => {
                            const headingText = indexToHeading(index);

                            return (
                                <>
                                    {index % 3 === 0 && index <= 6 && (
                                        <div className="px-2 py-4 pt-8" key={`padding-box-${index}`}>
                                            {headingText && <p className="font-bold">{headingText}</p>}
                                        </div>
                                    )}
                                    <tr key={`table-row-${index}`}>
                                        <td className={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>{`1x${
                                            reps(index) ?? weekToDefiningRep(week)
                                        }${index === 5 ? '+' : ''}`}</td>
                                        <td className={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>
                                            {percentageToText(percentage)}
                                        </td>
                                        <td className={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>{`${Math.max(
                                            20,
                                            roundToNearest(index) *
                                                Math.ceil(
                                                    (baseWeights[dayToExercise(day)] * percentage) /
                                                        roundToNearest(index),
                                                ),
                                        )} kg`}</td>
                                        <td className={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>
                                            {repsField({ index, percentage })}
                                        </td>
                                    </tr>
                                </>
                            );
                        })}
                    </tbody>
                </table>
                <Button className="mx-auto" onClick={handleClick}>
                    MORE!!!
                </Button>
            </div>
        </>
    );
};

export default Workout;
