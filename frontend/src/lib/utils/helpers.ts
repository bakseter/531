import type { Week, Day } from '@api/workout';

type CompExercise = 'dl' | 'bp' | 'sq' | 'op';

const comps: Array<CompExercise> = ['dl', 'bp', 'sq', 'op'];
const jokerAmount = 3;
const jokers: Array<number> = [...new Array(jokerAmount).keys()].map((i) => i + 1);

interface BaseWeights {
    dl: number;
    bp: number;
    sq: number;
    op: number;
}

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

const exerciseToText = (exercise: CompExercise): string => {
    switch (exercise) {
        case 'dl': {
            return 'Deadlift';
        }
        case 'bp': {
            return 'Bench Press';
        }
        case 'sq': {
            return 'Squat';
        }
        case 'op': {
            return 'Overhead Press';
        }
    }
};

const jokerWeightsExtend = (lastVal: number): Array<number> =>
    new Array(jokers.length).fill(lastVal).map((value: number, index) => value + 0.05 * (index + 1));

const weekToPercentages = (week: Week): Array<number> => {
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

    const jokerWeights = jokerWeightsExtend(normalWeights[normalWeights.length - 1]);

    return [...warmupWeights, ...normalWeights, ...jokerWeights];
};

const weekToSetsReps = (week: Week): Array<number> => {
    const warmupReps = [5, 5, 3];

    switch (week) {
        case 1: {
            return [...warmupReps, 5, 5, 5, ...jokers.map(() => 5)];
        }
        case 2: {
            return [...warmupReps, 3, 3, 3, ...jokers.map(() => 3)];
        }
        case 3: {
            return [...warmupReps, 5, 3, 1, ...jokers.map(() => 1)];
        }
    }
};

const percentageToText = (percentage: number): string => `${(percentage * 100).toFixed(0)}%`;

export type { CompExercise, BaseWeights };
export { comps, jokers, dayToExercise, exerciseToText, weekToPercentages, percentageToText, weekToSetsReps };
