<script lang="ts">
  import Workout from '$lib/components/Workout.svelte';
  import { days } from '$lib/constants';
  import type { BaseWeights } from '$lib/types';

  export let data: {
    cycle: number;
    week: number;
    day: number;
    baseWeights: BaseWeights;
    dates: Array<Date | undefined>;
  };
</script>

{#each days as day, index}
  <div class="mx-2">
    <Workout
      baseWeights={data.baseWeights}
      cycle={data.cycle}
      week={data.week}
      {day}
      date={data.dates[index]}
    />
  </div>
{/each}
