import { type decodeType, number, record, intersection } from 'typescript-json-decoder';

const baseWeightsDecoder = record({
	dl: number,
	bp: number,
	sq: number,
	op: number
});
type BaseWeights = decodeType<typeof baseWeightsDecoder>;

type CompExercise = keyof BaseWeights;

const baseWeightsModifierDecoder = intersection(baseWeightsDecoder, record({ cycle: number }));
type BaseWeightsModifier = decodeType<typeof baseWeightsModifierDecoder>;

const weekDecoder = (value: unknown) => {
	if (value === 1 || value === 2 || value === 3) return value;
	throw new TypeError('Invalid week');
};
type Week = decodeType<typeof weekDecoder>;
const safeWeekDecoder = (value: unknown): Week | undefined => {
	try {
		return weekDecoder(value);
	} catch (error) {
		return undefined;
	}
};

const dayDecoder = (value: unknown) => {
	if (value === 1 || value === 2 || value === 3 || value === 4) return value;
	throw new TypeError('Invalid day');
};
type Day = decodeType<typeof dayDecoder>;

const workoutDecoder = record({
	cycle: number,
	week: weekDecoder,
	day: dayDecoder,
	reps: number
});
type Workout = decodeType<typeof workoutDecoder>;

const profileDecoder = (value: unknown) => {
	if (value === 1 || value === 2 || value === 3 || value === 4) return value;
	throw new TypeError('Invalid profile');
};
type Profile = decodeType<typeof profileDecoder>;

export {
	baseWeightsDecoder,
	baseWeightsModifierDecoder,
	type CompExercise,
	type BaseWeights,
	type BaseWeightsModifier,
	weekDecoder,
	safeWeekDecoder,
	dayDecoder,
	workoutDecoder,
	profileDecoder,
	type Week,
	type Day,
	type Workout,
	type Profile
};
