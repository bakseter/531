<script lang="ts">
  import MenuLink from '$lib/components/MenuLink.svelte';
  import type { PageData } from '$./types';
  import { weeks } from '$lib/constants';

  export let data: PageData;
</script>

<div>
  <div class="grid grid-flow-col md:gap-1 lg:gap-2 xl:gap4">
    {#each weeks as week}
      <MenuLink
        href="/cycle/{data.cycle}/week/{week}"
        className={data.week === week ? 'bg-sky-500' : ''}
      >
        📅
        {week}
      </MenuLink>
    {/each}
    <MenuLink href="/cycle/{data.cycle}/edit">✏️</MenuLink>
  </div>

  <slot />
</div>
