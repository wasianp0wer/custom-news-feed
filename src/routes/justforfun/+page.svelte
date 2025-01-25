<script lang="ts"></script>

<div>
	<h1>Games</h1>
	<div class="games">
		<div class="game">
			<h1><a href="/justforfun/twerdle">Twerdle</a></h1>
			<img src="/images/justforfun/twerdle-gameplay.png" alt="twerdle gameplay" />
			<br />
			<div>A word deducing game based off the smash hit Wordle.</div>
		</div>
	</div>
	<h1>Comics</h1>
	<h1>More fun</h1>
</div>

<style>
	.section-divider {
		margin-top: 0.5em;
	}
	.games {
		display: grid;
		gap: 20px;
		grid-template-columns: repeat(2, 1fr); /* Flexible column sizes */
		grid-auto-rows: minmax(150px, auto); /* Ensure rows have a consistent minimum height */
		grid-auto-flow: dense; /* Allows grid items to fill empty spaces */
	}

	.game {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #fff;
		transition:
			transform 0.3s ease-in-out,
			border 0.3s ease-in-out;
		height: 100%;
	}

	.game:hover {
		transform: scale(var(--story-grow-factor));
		border: 2px solid var(--color-theme-1);
	}
</style>
