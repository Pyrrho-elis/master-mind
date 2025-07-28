<script>
	import SvelteOtp from '@k4ung/svelte-otp';
	import { onMount } from 'svelte';
	import GoInfo from 'svelte-icons/go/GoInfo.svelte';
	import IoMdShare from 'svelte-icons/io/IoMdShare.svelte';
	import IoMdArrowRoundBack from 'svelte-icons/io/IoMdArrowRoundBack.svelte';
	import Nav from '../components/Nav.svelte';
	import GameModeSelector from '../components/GameModeSelector.svelte';
	import { getTodayCode, getDayNumber, formatDate, isDailyChallengeCompleted, markDailyChallengeCompleted, getTodayChallengeData } from '$lib/dailyChallenge.js';
	import { shareResults } from '$lib/shareResults.js';

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
	let gameMode = 'daily';
	let showModeSelector = true;
	let dayNumber = 0;
	let todayDate = '';
	let shareSuccess = false;
	let attemptsContainer;
	let dailyCompleted = false;
	let todayChallengeData = null;
	const MAX_ATTEMPTS = 10;

	$: {
		if (value !== undefined) {
			validateInput(value);
		}
	}

	// Auto-scroll to latest attempt when score changes
	$: if (score.length > 0 && attemptsContainer) {
		setTimeout(() => {
			attemptsContainer.scrollTop = attemptsContainer.scrollHeight;
		}, 100);
	}

		const resetGame = () => {
		// For daily challenge, check if already completed
		if (gameMode === 'daily') {
			const isCompleted = isDailyChallengeCompleted();
			if (isCompleted) {
				// Don't allow reset for completed daily challenges
				return;
			}
		}
		
		if (gameMode === 'daily') {
			// Always set the current day info first
			dayNumber = getDayNumber();
			todayDate = formatDate(new Date());
			code = getTodayCode();
			
			// Check if daily challenge is already completed
			dailyCompleted = isDailyChallengeCompleted();
			todayChallengeData = getTodayChallengeData();
			
			// If completed, load the previous attempts
			if (dailyCompleted && todayChallengeData) {
				score = todayChallengeData.attempts;
				guess = todayChallengeData.attemptCount;
				gameWon = todayChallengeData.won;
				gameOver = !todayChallengeData.won;
			} else {
				score = [];
				guess = 0;
				gameWon = false;
				gameOver = false;
				dailyCompleted = false;
				todayChallengeData = null;
			}
		} else {
			code = generateUniqueNumbers().join('');
			score = [];
			guess = 0;
			gameWon = false;
			gameOver = false;
			dailyCompleted = false;
			todayChallengeData = null;
		}
		
		value = '';
		err = '';
		valid = false;
		inputError = '';
		isSubmitting = false;
		shareSuccess = false;
		
		// Auto-focus the first input after reset (only if not completed)
		if (!dailyCompleted) {
			setTimeout(() => {
				focusFirstInput();
			}, 100);
		}
	};

	const handleModeChange = (event) => {
		gameMode = event.detail.mode;
		showModeSelector = false;
		
		if (gameMode === 'daily') {
			// For daily challenge, check if already completed first
			const isCompleted = isDailyChallengeCompleted();
			const challengeData = getTodayChallengeData();
			
			if (isCompleted && challengeData) {
				// Load completed state
				dayNumber = getDayNumber();
				todayDate = formatDate(new Date());
				code = getTodayCode();
				score = challengeData.attempts;
				guess = challengeData.attemptCount;
				gameWon = challengeData.won;
				gameOver = !challengeData.won;
				dailyCompleted = true;
				todayChallengeData = challengeData;
			} else {
				// Start fresh daily challenge
				resetGame();
			}
		} else {
			// Practice mode - always reset
			resetGame();
		}
	};

	const backToModeSelection = () => {
		showModeSelector = true;
		gameWon = false;
		gameOver = false;
		score = [];
		guess = 0;
	};

	const handleShare = async () => {
		if (gameMode === 'daily') {
			const success = await shareResults(score, dayNumber, gameWon, MAX_ATTEMPTS);
			shareSuccess = success;
			
			// Reset share success message after 3 seconds
			setTimeout(() => {
				shareSuccess = false;
			}, 3000);
		}
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
		if (gameWon || gameOver || (gameMode === 'daily' && dailyCompleted)) {
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
			
			// Mark daily challenge as completed if in daily mode
			if (gameMode === 'daily') {
				markDailyChallengeCompleted(score, true);
				dailyCompleted = true;
			}
		}
		// Check game over condition
		else if (guess >= MAX_ATTEMPTS) {
			gameOver = true;
			
			// Mark daily challenge as completed if in daily mode
			if (gameMode === 'daily') {
				markDailyChallengeCompleted(score, false);
				dailyCompleted = true;
			}
		} else {
			// Auto-focus first input for next guess
			setTimeout(() => {
				focusFirstInput();
			}, 50);
		}

		isSubmitting = false;
	};

	const handleKeydown = (e) => {
		if (gameWon || gameOver || isSubmitting || (gameMode === 'daily' && dailyCompleted)) return;

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
		document.addEventListener('keydown', handleKeydown);
		
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const conf = () => {
		// Simple confetti effect
		const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
		const confettiCount = 50;
		
		for (let i = 0; i < confettiCount; i++) {
			setTimeout(() => {
				const confetti = document.createElement('div');
				confetti.style.position = 'fixed';
				confetti.style.left = Math.random() * window.innerWidth + 'px';
				confetti.style.top = '-10px';
				confetti.style.width = '10px';
				confetti.style.height = '10px';
				confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
				confetti.style.borderRadius = '50%';
				confetti.style.pointerEvents = 'none';
				confetti.style.zIndex = '9999';
				confetti.style.animation = 'confetti-fall 3s linear forwards';
				
				document.body.appendChild(confetti);
				
				// Remove confetti after animation
				setTimeout(() => {
					if (confetti.parentNode) {
						confetti.parentNode.removeChild(confetti);
					}
				}, 3000);
			}, i * 50);
		}
	};


</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
	<Nav />
	
	<main class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
		<div class="w-full max-w-6xl">
			{#if showModeSelector}
				<GameModeSelector selectedMode={gameMode} on:modeChange={handleModeChange} />
			{:else}
				<!-- Game Header -->
				<div class="text-center mb-6">
					
					{#if gameMode === 'daily'}
						<div class="mb-2">
							<h1 class="text-2xl sm:text-3xl font-bold text-heading">Daily Challenge</h1>
							<p class="text-sm text-body">Day #{dayNumber} • {todayDate}</p>
							{#if dailyCompleted}
								<p class="text-xs text-green-600 dark:text-green-400 mt-1">✓ Completed today</p>
							{/if}
						</div>
					{:else}
						<div class="mb-2">
							<h1 class="text-2xl sm:text-3xl font-bold text-heading">Practice Mode</h1>
							<p class="text-sm text-body">Random codes, unlimited attempts</p>
						</div>
					{/if}
					
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
								<div class="flex gap-3 justify-center">
									{#if gameMode === 'daily'}
										<button 
											on:click={handleShare}
											class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm w-32"
										>
											<IoMdShare class="w-3 h-3 mr-1" />
											Share
										</button>
									{:else}
										<button 
											on:click={resetGame} 
											class="flex-1 btn-primary"
										>
											Play Again
										</button>
									{/if}
								</div>
								{#if shareSuccess}
									<p class="text-sm text-green-600 dark:text-green-400 mt-2">Results copied to clipboard!</p>
								{/if}
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
								<div class="flex gap-3">
									{#if gameMode === 'daily'}
										<button 
											on:click={handleShare}
											class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
										>
											<IoMdShare class="w-3 h-3 mr-1" />
											Share
										</button>
									{:else}
										<button 
											on:click={resetGame} 
											class="flex-1 btn-primary"
										>
											Try Again
										</button>
									{/if}
								</div>
								{#if shareSuccess}
									<p class="text-sm text-green-600 dark:text-green-400 mt-2">Results copied to clipboard!</p>
								{/if}
							</div>
						{:else}
							<div class="flex flex-col flex-1 justify-center">
								{#if gameMode === 'daily' && dailyCompleted}
									<div class="text-center py-8">
										<div class="text-4xl mb-4">✅</div>
										<h3 class="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Daily Challenge Completed!</h3>
										<p class="text-sm text-body">Come back tomorrow for a new challenge.</p>
									</div>
								{:else}
																		<label class="block text-sm font-medium mb-4 text-center text-body">
										Enter your 4-digit code (1-9, no repeats, no 0)
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
								{/if}
							</div>
						{/if}
					</div>

					<!-- Results Card -->
					<div class="card p-6 sm:p-8 flex flex-col min-h-[400px]">
						<div class="flex justify-between items-center mb-4">
							<p class="text-lg font-semibold tracking-wide text-heading">
								Attempts
							</p>
							<div class="flex gap-2">
								<button
									on:click={backToModeSelection}
									class="px-3 py-2 text-md text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors w-32 h-10 rounded-lg flex items-center justify-center"
								>
									<IoMdArrowRoundBack class="w-4 h-4" />
									Back
								</button>
								{#if gameMode !== 'daily'}
									<button
										on:click={resetGame}
										class="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
									>
										New Game
									</button>
								{/if}
							</div>
						</div>
						<div class="flex justify-between text-xs mb-3 px-2">
							<span class="font-medium">Attempt</span>
							<span class="font-medium">Exists</span>
							<span class="font-medium">Correct</span>
						</div>
						<div 
							bind:this={attemptsContainer}
							class="max-h-64 overflow-y-auto rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 scroll-smooth"
						>
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
			{/if}
		</div>
	</main>
</div>
