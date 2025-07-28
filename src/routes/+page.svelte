<script src="$lib/confetti.MIDIInput.js">
	import SvelteOtp from '@k4ung/svelte-otp';
	import { onMount } from 'svelte';
	import GoInfo from 'svelte-icons/go/GoInfo.svelte';
	import Nav from '../components/Nav.svelte';

	let value = '';
	let err = '';
	let code = '';
	let score = [];
	let valid = false;
	let guess = 0;
	let gameWon = false;
	let gameOver = false;
	let inputError = '';
	let isSubmitting = false;
	let otpComponent;
	const MAX_ATTEMPTS = 10;

	$: {
		if (value !== undefined) {
			validateInput(value);
		}
	}

	const resetGame = () => {
		code = generateUniqueNumbers().join('');
		score = [];
		value = '';
		err = '';
		valid = false;
		guess = 0;
		gameWon = false;
		gameOver = false;
		inputError = '';
		isSubmitting = false;
		
		// Auto-focus the first input after reset
		setTimeout(() => {
			focusFirstInput();
		}, 100);
	};

	const focusFirstInput = () => {
		if (otpComponent && !gameWon && !gameOver) {
			const inputs = otpComponent.querySelectorAll('input');
			if (inputs.length > 0) {
				inputs[0].focus();
			}
		}
	};

	const validateInput = (input) => {
		if (!input || input.length === 0) {
			valid = false;
			inputError = '';
			return;
		}

		// Check if all characters are digits
		if (!/^\d+$/.test(input)) {
			valid = false;
			inputError = 'Only digits are allowed';
			return;
		}

		// Check length
		if (input.length !== 4) {
			valid = false;
			inputError = input.length < 4 ? 'Enter 4 digits' : 'Too many digits';
			return;
		}

		// Check for unique digits
		const seenDigits = new Set();
		for (const digit of input) {
			if (seenDigits.has(digit)) {
				valid = false;
				inputError = 'Each digit must be unique';
				return;
			}
			seenDigits.add(digit);
		}

		// Check for zero
		if (input.includes('0')) {
			valid = false;
			inputError = 'Zero is not allowed';
			return;
		}

		valid = true;
		inputError = '';
	};

	const handleSolve = async () => {
		if (gameWon || gameOver) {
			return;
		}

		// Validate the current value inline
		if (!value || value.length !== 4) {
			inputError = 'Enter 4 digits';
			return;
		}

		// Check for unique digits
		const seenDigits = new Set();
		for (const digit of value) {
			if (seenDigits.has(digit)) {
				inputError = 'Each digit must be unique';
				return;
			}
			seenDigits.add(digit);
		}

		// Check for zero
		if (value.includes('0')) {
			inputError = 'Zero is not allowed';
			return;
		}

		isSubmitting = true;

		// Simulate a small delay for better UX
		await new Promise(resolve => setTimeout(resolve, 100));

		let correctSpot = 0;
		let exists = 0;
		
		// Calculate feedback
		for (let index in value) {
			if (value[index] == code[index]) {
				correctSpot++;
			}
			if (code.includes(value[index])) {
				exists++;
			}
		}

		// Add to score
		score = [...score, { correctSpot: correctSpot, exists: exists, attempt: value }];
		
		// Clear input
		value = '';
		valid = false;
		inputError = '';
		guess++;

		// Check win condition BEFORE resetting variables
		if (correctSpot === 4) {
			gameWon = true;
			conf();
		}
		// Check game over condition
		else if (guess >= MAX_ATTEMPTS) {
			gameOver = true;
		} else {
			// Auto-focus first input for next guess
			setTimeout(() => {
				focusFirstInput();
			}, 50);
		}

		isSubmitting = false;
	};

	const handleKeydown = (e) => {
		if (gameWon || gameOver || isSubmitting) return;

		const key = e.key;
		
		// Handle Enter
		if (key === 'Enter') {
			e.preventDefault();
			handleSolve();
		}
		// Handle Backspace
		else if (key === 'Backspace') {
			e.preventDefault();
			value = value.slice(0, -1);
		}
		// Handle Escape to clear
		else if (key === 'Escape') {
			e.preventDefault();
			value = '';
			focusFirstInput();
		}
		// Handle Tab to focus next input
		else if (key === 'Tab') {
			// Let the browser handle tab navigation naturally
			return;
		}
		// Handle any other key to focus first input if not already focused
		else if (!e.target.matches('input')) {
			focusFirstInput();
		}
	};

	function generateUniqueNumbers() {
		let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		for (let i = numbers.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[numbers[i], numbers[j]] = [numbers[j], numbers[i]];
		}

		return numbers.slice(0, 4);
	}

	onMount(async () => {
		resetGame();
		document.addEventListener('keydown', handleKeydown);
		
		// Auto-focus on mount
		setTimeout(() => {
			focusFirstInput();
		}, 200);
		
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const conf = () => {
		confetti.setCount(75);
		confetti.setSize(1);
		confetti.setPower(25);
		confetti.setFade(false);
		confetti.destroyTarget(true);
	};
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
	<Nav />
	
	<main class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
		<div class="w-full max-w-6xl">
			<div class="text-center mb-8">
				<p class="text-sm text-body">
					Attempt {guess} of {MAX_ATTEMPTS}
				</p>
			</div>

			<!-- Responsive grid: input and results side by side on lg+, stacked on mobile -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
				<!-- Input Card -->
				<div class="card p-6 sm:p-8 flex flex-col justify-between min-h-[400px]">
					{#if gameWon}
						<div class="text-center py-8 flex-1 flex flex-col justify-center">
							<div class="text-5xl mb-4">🎉</div>
							<h2 class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-3 text-heading">
								You Win!
							</h2>
							<p class="mb-6 text-body">
								You cracked the code in {guess} attempts.
							</p>
							<button 
								on:click={resetGame} 
								class="btn-primary w-full"
							>
								Play Again
							</button>
						</div>
					{:else if gameOver}
						<div class="text-center py-8 flex-1 flex flex-col justify-center">
							<div class="text-5xl mb-4">💥</div>
							<h2 class="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-3 text-heading">
								Game Over
							</h2>
							<p class="mb-6 text-body">
								The code was <span class="font-mono font-bold">{code}</span>
							</p>
							<button 
								on:click={resetGame} 
								class="btn-primary w-full"
							>
								Try Again
							</button>
						</div>
					{:else}
						<div class="flex flex-col flex-1 justify-center">
							<label class="block text-sm font-medium mb-4 text-center text-body">
								Enter your 4-digit code (1-9, no repeats)
							</label>
							<div bind:this={otpComponent} class="flex justify-center gap-2 mb-4">
								<SvelteOtp
									disableDefaultStyle="true"
									separatorClass="text-gray-400 dark:text-gray-500 text-xl mx-1"
									placeholder="•"
									separator="-"
									numberOnly
									numOfInputs={4}
									on:keydown={handleKeydown}
									bind:value
									disabled={isSubmitting}
								/>
							</div>
							{#if inputError}
								<p class="text-red-600 dark:text-red-400 text-sm text-center mb-4 text-body">
									{inputError}
								</p>
							{/if}
							<button
								on:click={handleSolve}
								disabled={!valid || isSubmitting}
								class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? 'Checking...' : 'Submit'}
							</button>
						</div>
					{/if}
				</div>

				<!-- Results Card -->
				<div class="card p-6 sm:p-8 flex flex-col min-h-[400px]">
					<div class="flex justify-between items-center mb-4">
						<p class="text-lg font-semibold tracking-wide text-heading">
							Attempts
						</p>
						<button
							on:click={resetGame}
							class="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
						>
							New Game
						</button>
					</div>
					<div class="flex justify-between text-xs mb-3 px-2">
						<span class="font-medium">Attempt</span>
						<span class="font-medium">Exists</span>
						<span class="font-medium">Correct</span>
					</div>
					<div class="max-h-64 overflow-y-auto rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
						{#each score as attempt, i}
							<div class="attempt-row flex justify-between items-center py-3 px-4
								{(i % 2 === 0) ? 'bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'} 
								transition-colors duration-150">
								<span class="font-mono font-bold text-lg">
									{attempt.attempt}
								</span>
								<span class="text-blue-600 dark:text-blue-400 font-bold text-lg">
									{attempt.exists}
								</span>
								<span class="text-green-600 dark:text-green-400 font-bold text-lg">
									{attempt.correctSpot}
								</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
