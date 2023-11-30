<script lang="ts">
  import { format, formatISO, parseISO } from 'date-fns';
  import type { Week, Day } from '$lib/types';
  import { onMount } from 'svelte';

  export let cycle: number;
  export let week: Week;
  export let day: Day;
  export let date: Date | undefined;
  export const profile: number = 1;

  const putDate = async () => {
    const response = await fetch(
      `/api/workout/date?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
      {
        method: 'PUT',
        body: JSON.stringify({ date: formatISO(date) }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      date = parseISO(data.date);
    }
  };

  onMount(async () => {
    const response = await fetch(
      `/api/workout/date?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`
    );

    if (response.status === 200) {
      const data = await response.json();
      date = parseISO(data.date);
    }
  });
</script>

{#if date === undefined}
  <input name="date" class="border-2 rounded-md border-sky-500" type="date" bind:value={date} />
  <button on:click={putDate}>Go</button>
{:else}
  <div class="grid grid-flow-col items-center text-start">
    <button class="text-sm">{format(parseISO(date), 'EEEE dd. MMMM yyyy')}</button>
  </div>
{/if}
