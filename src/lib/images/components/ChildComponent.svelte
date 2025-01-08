<script lang="ts">
	// Props (input from parent)
	type childProps = {
		initialCount: number;
		currentCount: (count: number) => void;
	};

	let { initialCount, currentCount }: childProps = $props(); // instead of `export let`

	// Reactive state
	let count = $state<number>(initialCount);

	// Derived state: double the count
	const doubleCount = $derived(count * 2);

	// Effect: Call output function when count changes
	$effect(() => {
		currentCount(count);
	});

	// Functions to update the state
	function increment(): void {
		count += 1;
	}

	function decrement(): void {
		count -= 1;
	}
</script>

<div>
	<h3>Child Component</h3>
	<p>Count: {count}</p>
	<p>Double Count: {doubleCount}</p>
	<button onclick={increment}>Increment</button>
	<button onclick={decrement}>Decrement</button>
</div>

<style>
	button {
		margin-right: 0.5rem;
	}

	div {
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		margin-bottom: 1rem;
	}
</style>
