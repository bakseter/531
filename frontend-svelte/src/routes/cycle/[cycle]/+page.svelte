<script lang="ts">
  import MenuLink from '$lib/components/MenuLink.svelte';
  import { weeks } from '$lib/constants';

  export let data: { cycle: number };
</script>

<div class="flex flex-col items-center py-16">
  <h3 class="pb-6">Please select a week 👇</h3>
  <div class="flex flex-row">
    {#each weeks as week}
      <MenuLink href="/cycle/{data.cycle}/week/{week}">
        Week {week}
      </MenuLink>
    {/each}
  </div>
</div>
