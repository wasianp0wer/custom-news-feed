import type { PageServerLoad } from './$types';

type Grid = number[][];

const SIZE = 9;
const SUBGRID_SIZE = 3;

// Helper function to create an empty grid
function createEmptyGrid(): Grid {
	return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

// Function to check if placing a number is valid
function isValidPlacement(grid: Grid, row: number, col: number, num: number): boolean {
	// Check row and column
	for (let i = 0; i < SIZE; i++) {
		if (grid[row][i] === num || grid[i][col] === num) return false;
	}

	// Check subgrid
	const startRow = Math.floor(row / SUBGRID_SIZE) * SUBGRID_SIZE;
	const startCol = Math.floor(col / SUBGRID_SIZE) * SUBGRID_SIZE;
	for (let i = 0; i < SUBGRID_SIZE; i++) {
		for (let j = 0; j < SUBGRID_SIZE; j++) {
			if (grid[startRow + i][startCol + j] === num) return false;
		}
	}

	return true;
}

// Function to fill the grid using backtracking
function fillGrid(grid: Grid): boolean {
	for (let row = 0; row < SIZE; row++) {
		for (let col = 0; col < SIZE; col++) {
			if (grid[row][col] === 0) {
				const start = Math.floor(Math.random() * SIZE) + 1;
				for (let i = start; i < SIZE + start; i++) {
					const num = (i % SIZE) + 1;
					if (isValidPlacement(grid, row, col, num)) {
						grid[row][col] = num;
						if (fillGrid(grid)) return true;
						grid[row][col] = 0; // Backtrack
					}
				}
				return false; // No valid number found
			}
		}
	}
	return true; // Grid filled successfully
}

// Function to check if the grid has a unique solution
function hasUniqueSolution(grid: Grid): boolean {
	let solutionCount = 0;

	function solve(grid: Grid): boolean {
		for (let row = 0; row < SIZE; row++) {
			for (let col = 0; col < SIZE; col++) {
				if (grid[row][col] === 0) {
					for (let num = 1; num <= SIZE; num++) {
						if (isValidPlacement(grid, row, col, num)) {
							grid[row][col] = num;
							if (solve(grid)) solutionCount++;
							grid[row][col] = 0;
							if (solutionCount > 1) return false; // More than one solution
						}
					}
					return false; // No valid number found
				}
			}
		}
		return true; // One solution found
	}

	solve(JSON.parse(JSON.stringify(grid))); // Solve on a copy
	return solutionCount === 1;
}

// Function to remove numbers to create the puzzle
function removeNumbers(grid: Grid, clues: number): Grid {
	const puzzle = JSON.parse(JSON.stringify(grid));
	const totalCells = SIZE * SIZE;

	while (totalCells - clues > 0) {
		const row = Math.floor(Math.random() * SIZE);
		const col = Math.floor(Math.random() * SIZE);

		if (puzzle[row][col] !== 0) {
			const backup = puzzle[row][col];
			puzzle[row][col] = 0;

			if (!hasUniqueSolution(puzzle)) {
				puzzle[row][col] = backup; // Restore if uniqueness is broken
			} else {
				clues++; // One less clue
			}
		}
	}

	return puzzle;
}

// Main function to generate a Sudoku puzzle
function generateSudoku(clues: number = 30): Grid {
	const grid = createEmptyGrid();
	fillGrid(grid); // Generate a complete grid
	return removeNumbers(grid, clues); // Create the puzzle
}

export const load = (() => {
	const sudoku = generateSudoku();
	console.table(sudoku);
	return {
		puzzle: sudoku
	};
}) satisfies PageServerLoad;
