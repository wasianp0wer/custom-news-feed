<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		puzzle: number[][];
	}

	let { puzzle }: Props = $props();

	// Copy of the puzzle to keep track of user inputs

	let userSolution: number[][] = $state([]);

	onMount(() => {
		userSolution = puzzle.map((row) => [...row]);
	});

	function isSolutionCorrect() {
		// Check rows
		for (let row of userSolution) {
			if (!isValidSet(row)) return false;
		}

		// Check columns
		for (let col = 0; col < 9; col++) {
			const column = userSolution.map((row) => row[col]);
			if (!isValidSet(column)) return false;
		}

		// Check 3x3 grids
		for (let gridRow = 0; gridRow < 3; gridRow++) {
			for (let gridCol = 0; gridCol < 3; gridCol++) {
				const grid = [];
				for (let row = 0; row < 3; row++) {
					for (let col = 0; col < 3; col++) {
						grid.push(userSolution[gridRow * 3 + row][gridCol * 3 + col]);
					}
				}
				if (!isValidSet(grid)) return false;
			}
		}

		return true;
	}

	function isValidSet(set: number[]): boolean {
		const numbers = set.filter((num) => num !== 0);
		return new Set(numbers).size === numbers.length && numbers.every((n) => n >= 1 && n <= 9);
	}

	function handleInput(row: number, col: number): void {}
	// function handleInput(row: number, col: number): void {
	// 	const num = userSolution[row][col];
	// 	if (!isNaN(num) && num >= 1 && num <= 9) {
	// 		userSolution[row][col] = num;
	// 	} else if (value === '') {
	// 		userSolution[row][col] = 0;
	// 	}
	// }
</script>

<div>
	{puzzle}
	<div class="grid">
		{#each puzzle as row, rowIndex}
			{#each row as cell, colIndex}
				<div class="cell">
					<input
						type="text"
						maxlength="1"
						bind:value={userSolution[rowIndex][colIndex]}
						oninput={(e) => handleInput(rowIndex, colIndex)}
						readonly={puzzle[rowIndex][colIndex] !== 0}
					/>
				</div>
			{/each}
		{/each}
	</div>

	<button onclick={() => alert(isSolutionCorrect() ? 'Correct!' : 'Incorrect!')}> Check Solution </button>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(9, 1fr);
		gap: 2px;
		width: 360px;
	}

	.cell {
		width: 40px;
		height: 40px;
		text-align: center;
		font-size: 18px;
		border: 1px solid #ccc;
	}

	.cell input {
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 18px;
		border: none;
		outline: none;
	}

	.cell input[readonly] {
		background-color: #f0f0f0;
	}

	button {
		margin-top: 20px;
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
	}
</style>
