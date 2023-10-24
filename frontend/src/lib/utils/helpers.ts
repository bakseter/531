import type { CompExercise, BaseWeights } from '@api/base-weights';
import type { Week, Day } from '@api/workout';
import { jokers } from '@utils/constants';

const addToBaseWeights = (baseWeights: BaseWeights, cycle: number): BaseWeights => ({
    dl: baseWeights.dl + (cycle - 1) * 5,
    bp: baseWeights.bp + (cycle - 1) * 2.5,
    sq: baseWeights.sq + (cycle - 1) * 5,
    op: baseWeights.op + (cycle - 1) * 2.5,
});

const dayToExercise = (day: Day): CompExercise => {
    switch (day) {
        case 1: {
            return 'dl';
        }
        case 2: {
            return 'bp';
        }
        case 3: {
            return 'sq';
        }
        case 4: {
            return 'op';
        }
    }
};

const weekToDefiningRep = (week: Week): number => {
    switch (week) {
        case 1: {
            return 5;
        }
        case 2: {
            return 3;
        }
        case 3: {
            return 1;
        }
    }
};

const exerciseToText = (exercise: CompExercise): string => {
    switch (exercise) {
        case 'dl': {
            return 'Deadlift';
        }
        case 'bp': {
            return 'Bench press';
        }
        case 'sq': {
            return 'Squat';
        }
        case 'op': {
            return 'Overhead press';
        }
    }
};

const jokerWeightsExtend = (lastVal: number, customJokersLengthAdd?: number): Array<number> =>
    new Array(jokers.length + (customJokersLengthAdd ?? 0))
        .fill(lastVal)
        .map((value: number, index) => value + 0.05 * (index + 1));

const weekToPercentages = (week: Week, customJokersLengthAdd?: number): Array<number> => {
    const warmupWeights = [0.4, 0.5, 0.6];

    const normalWeights = ((week: Week): Array<number> => {
        switch (week) {
            case 1: {
                return [0.65, 0.75, 0.85];
            }
            case 2: {
                return [0.7, 0.8, 0.9];
            }
            case 3: {
                return [0.75, 0.85, 0.95];
            }
        }
    })(week);

    const jokerWeights = jokerWeightsExtend(normalWeights[normalWeights.length - 1], customJokersLengthAdd);

    return [...warmupWeights, ...normalWeights, ...jokerWeights];
};

const weekToSetsReps = (week: Week): Array<number> => {
    const warmupReps = [5, 5, 3];
    const defRep = weekToDefiningRep(week);
    const defReps = week === 3 ? [5, 3, defRep] : [defRep, defRep, defRep];

    switch (week) {
        case 1: {
            return [...warmupReps, ...defReps, ...jokers.map(() => 5)];
        }
        case 2: {
            return [...warmupReps, ...defReps, ...jokers.map(() => 3)];
        }
        case 3: {
            return [...warmupReps, ...defReps, ...jokers.map(() => 1)];
        }
    }
};

const percentageToText = (percentage: number): string => `${(percentage * 100).toFixed(0)}%`;

const safeParseInt = (value: unknown): number | undefined => {
    if (typeof value === 'string') {
        const parsed = Number.parseInt(value);
        if (Number.isInteger(parsed)) return parsed;
    }
};

export {
    dayToExercise,
    exerciseToText,
    weekToPercentages,
    percentageToText,
    weekToSetsReps,
    addToBaseWeights,
    weekToDefiningRep,
    safeParseInt,
};
