import type { Week, Day } from '@/schema/workout';

const cycles: Array<number> = [1, 2, 3, 4, 5];
const weeks: Array<Week> = [1, 2, 3];
const days: Array<Day> = [1, 2, 3, 4];
const backendApiVersion: string = process.env.NEXT_PUBLIC_BACKEND_API_VERSION ?? 'v1';
const backendUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';
const backendUrlWithApi: string = `${backendUrl}/${backendApiVersion}`;
const warmupCutoff: number = 2;
const jokerCutoff: number = 5;

export { cycles, weeks, days, backendUrlWithApi as backendUrl, warmupCutoff, jokerCutoff };
