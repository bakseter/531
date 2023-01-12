import type { Week, Day } from '@api/workout';

type CompExercise = 'dl' | 'bp' | 'sq' | 'op';

const comps: Array<CompExercise> = ['dl', 'bp', 'sq', 'op'];

interface BaseWeights {
    dl: number;
    bp: number;
    sq: number;
    op: number;
}

const dayToExercise = (day: Day): CompExercise => {
    switch (day) {
        case 1: {
            return 'bp';
        }
        case 2: {
            return 'dl';
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
        case 'bp': {
            return 'Bench Press';
        }
        case 'dl': {
            return 'Deadlift';
        }
        case 'sq': {
            return 'Squat';
        }
        case 'op': {
            return 'Overhead Press';
        }
    }
};

const weekToPercentages = (week: Week, warmup: boolean = true): Array<number> => {
    const warmupWeights = [0.4, 0.5, 0.6];

    switch (week) {
        case 1: {
            return [...(warmup ? warmupWeights : []), 0.65, 0.75, 0.85];
        }
        case 2: {
            return [...(warmup ? warmupWeights : []), 0.7, 0.8, 0.9];
        }
        case 3: {
            return [...(warmup ? warmupWeights : []), 0.75, 0.85, 0.95];
        }
    }
};

const weekToSetsReps = (week: Week): Array<number> => {
    const warmupReps = [5, 5, 3];

    switch (week) {
        case 1: {
            return [...warmupReps, 5, 5, 5, 5, 5, 5];
        }
        case 2: {
            return [...warmupReps, 3, 3, 3, 3, 3, 3];
        }
        case 3: {
            return [...warmupReps, 5, 3, 1, 1, 1, 1];
        }
    }
};

const percentageToText = (percentage: number): string => `${percentage * 100}%`;

export type { CompExercise, BaseWeights };
export { comps, dayToExercise, exerciseToText, weekToPercentages, percentageToText, weekToSetsReps };
