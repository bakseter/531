<script lang="ts">
  import Workout from '$lib/components/Workout.svelte';
  import { days } from '$lib/constants';
  import type { BaseWeights } from '$lib/types';

  export let data: { cycle: number; day: number; baseWeights: BaseWeights };
</script>

{#each days as day}
  <div class="mx-2">
    <Workout baseWeights={data.baseWeights} cycle={data.cycle} week={data.week} {day} />
  </div>
{/each}
