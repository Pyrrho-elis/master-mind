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
		//console.log('New code:', code);
		
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

<div class="flex flex-col h-screen items-center bg-black">
	<div class="flex justify-between items-center w-screen text-white h-16">
		<Nav />
	</div>
	<div
		class="flex flex-col justify-center items-center p-6 rounded-lg border-2 bg-gray gap-8 my-10 w-[350px] text-black"
	>
		<div class="flex justify-between items-center w-full">
			<p class="text-white text-lg">Attempts: {guess}/{MAX_ATTEMPTS}</p>
			<button
				on:click={resetGame}
				class="text-black rounded-lg p-2 bg-white hover:bg-gray-200 transition-colors"
			>
				New Game
			</button>
		</div>

		{#if gameWon}
			<div class="text-center">
				<h1 class="text-3xl text-green-600 font-bold mb-2">🎉 You Win! 🎉</h1>
				<p class="text-white">You solved it in {guess} attempts!</p>
			</div>
		{:else if gameOver}
			<div class="text-center">
				<h1 class="text-3xl text-red-600 font-bold mb-2">Game Over</h1>
				<p class="text-white">The code was: <span class="font-bold text-yellow-400">{code}</span></p>
			</div>
		{/if}

		{#if !gameWon && !gameOver}
			<div class="w-full">
				<div class="mb-4">
					<label class="block text-white text-sm font-medium mb-2 text-center">
						Enter your 4-digit code (1-9, no repeats)
					</label>
					<div bind:this={otpComponent}>
						<SvelteOtp
							disableDefaultStyle="true"
							separatorClass="border-blue-700 text-3xl font-bold text-white"
							placeholder="•"
							separator="-"
							numberOnly
							numOfInputs={4}
							on:keydown={handleKeydown}
							bind:value
							disabled={isSubmitting}
						/>
					</div>
				</div>
				
				{#if inputError}
					<p class="text-red-500 text-sm mb-4 text-center">{inputError}</p>
				{/if}

				<button 
					on:click={handleSolve} 
					disabled={!valid || isSubmitting}
					class="w-full text-black my-4 rounded-lg p-3 bg-white hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
				>
					{isSubmitting ? 'Cracking...' : 'Crack Code'}
				</button>

				<div class="text-center text-white text-sm opacity-75">
					<p>💡 Just start typing! Press Enter to submit, Escape to clear</p>
				</div>
			</div>
		{/if}

		<div class="flex justify-between gap-10">
			<div class="text-white flex flex-col justify-center items-center">
				<h1 class="text-xl font-bold">A</h1>
				{#each score as a}
					<p class="text-white">{a.attempt}</p>
				{/each}
			</div>
			<hr class="border-l-8 h-full w-[1px]" />
			<div class="text-white flex flex-col justify-center items-center">
				<h1 class="text-xl font-bold">E</h1>
				{#each score as a}
					<p class="text-white">{a.exists}</p>
				{/each}
			</div>
			<div class="border-l-8 h-full w-[1px]" />
			<div class="text-white flex flex-col justify-center items-center">
				<h1 class="text-xl font-bold">C</h1>
				{#each score as a}
					<p class="text-white">{a.correctSpot}</p>
				{/each}
			</div>
		</div>
	</div>
</div>
