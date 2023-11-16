<script>
	import { comps } from '$lib/constants';
	import { exerciseToText } from '$lib/utils';
</script>

<div class="grid grid-cols-1">
	<div class="flex mx-auto">
		<div class="grid grid-cols-1 gap-2 py-8">
			<h3 class="text-center">Please enter your base weights below 👇</h3>
			<form method="POST">
				<div class="grid grid-cols-1 gap-1">
					{#each comps as value}
						<div>
							<label for={value} class="block text-2xl font-bold py-2" key={`text-${value}`}>
								{exerciseToText(value)}
							</label>
							<input
								id={value}
								type="number"
								step=".25"
								key={`input-${value}`}
								placeholder={exerciseToText(value)}
								class="border-2 border-gray-300 rounded-md p-2"
							/>
						</div>
					{/each}
					<input class="cursor-pointer" type="submit" value="Submit" />
				</div>
			</form>
		</div>
	</div>
</div>
