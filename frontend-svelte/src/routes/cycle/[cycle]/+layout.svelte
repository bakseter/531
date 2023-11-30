<script lang="ts">
  import MenuLink from '$lib/components/MenuLink.svelte';
  import { cycles } from '$lib/constants';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div>
  <div class="grid grid-flow-col md:gap-1 lg:gap-2 xl:gap4">
    {#each cycles as cycle}
      <MenuLink href="/cycle/{cycle}/week/1" className={data.cycle === cycle ? 'bg-sky-500' : ''}>
        🔄 {cycle}
      </MenuLink>
    {/each}
    <MenuLink href="/profile">👤</MenuLink>
  </div>

  <slot />
</div>
