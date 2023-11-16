<script lang="ts">
	export let href: string;
	export let className: string;
</script>

<a {href} class="text-center p-2 m-2 bg-sky-300 shadow-sm rounded-md {className}">
	<slot />
</a>
