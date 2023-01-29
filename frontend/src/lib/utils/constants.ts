import { type Week, type Day } from '@api/workout';

const cycles: Array<number> = [1, 2, 3];
const weeks: Array<Week> = [1, 2, 3];
const days: Array<Day> = [1, 2, 3, 4];

const jokerAmount = 4;
const jokers: Array<number> = [...new Array(jokerAmount).keys()].map((i) => i + 1);

export { cycles, weeks, days, jokers };
