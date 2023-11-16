<script>
	import MenuLink from '$lib/components/MenuLink.svelte';
	import { cycles } from '$lib/constants';

	export const cyclePrefix = 'Cycle';
</script>

<div>
	<div class="grid grid-flow-col md:gap-1 lg:gap-2 xl:gap4">
		{#each cycles as cycle}
			<MenuLink href="/cycle/{cycle}/week/1">
				{cyclePrefix}
				{cycle}
			</MenuLink>
		{/each}
	</div>

	<slot />
</div>
