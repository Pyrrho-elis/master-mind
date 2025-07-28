<script src="$lib/confetti.MIDIInput.js">
	import { onMount } from 'svelte';
	import IoMdArrowRoundBack from 'svelte-icons/io/IoMdArrowRoundBack.svelte';
	import Nav from '../../components/Nav.svelte';
</script>

<div class="min-h-screen bg-gray-100 flex flex-col">
	<Nav />
	<main class="flex-1 flex flex-col items-center px-2 sm:px-4 py-6">
		<div class="w-full max-w-2xl">
			<div class="bg-white rounded-xl border border-gray-300 shadow p-4 sm:p-8">
				<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">How To Play KrackTheKode</h1>

				<div class="mb-6">
					<h2 class="text-lg sm:text-2xl font-semibold text-yellow-600 mb-2">Objective</h2>
					<p class="text-gray-700 text-base sm:text-lg">
						Guess the secret 4-digit code in as few attempts as possible. You have a maximum of 10 attempts to crack the code!
					</p>
				</div>

				<ol class="flex flex-col gap-6">
					<li class="bg-gray-50 rounded-lg p-4 sm:p-6 w-full">
						<h3 class="text-base sm:text-xl font-semibold text-blue-700 mb-2">1. Make A Guess</h3>
						<p class="text-gray-700">
							Enter any 4-digit number as your guess. Each digit must be unique (no repeating digits allowed).
						</p>
					</li>

					<li class="bg-gray-50 rounded-lg p-4 sm:p-6 w-full">
						<h3 class="text-base sm:text-xl font-semibold text-blue-700 mb-2">2. Understand The Feedback</h3>
						<p class="text-gray-700 mb-3">
							After submitting, you'll receive two pieces of information to help you narrow down the correct code:
						</p>
						<div class="flex flex-col sm:flex-row gap-4">
							<div class="bg-white border border-gray-200 p-4 rounded-lg flex-1">
								<h4 class="font-bold text-base mb-1 text-blue-700">Exists</h4>
								<p class="text-sm text-gray-600">
									How many digits from your guess exist somewhere in the secret code, regardless of position.
								</p>
								<div class="mt-2 p-2 bg-gray-50 rounded">
									<strong>Example:</strong> Your Guess: 1234, Code: 7249<br />
									<strong>E: 2</strong> (because digits 2 and 4 exist in the code)
								</div>
							</div>
							<div class="bg-white border border-gray-200 p-4 rounded-lg flex-1">
								<h4 class="font-bold text-base mb-1 text-green-700">Correct</h4>
								<p class="text-sm text-gray-600">
									How many digits are in the correct position (this is always ≤ the number in Exists).
								</p>
								<div class="mt-2 p-2 bg-gray-50 rounded">
									<strong>Example:</strong> Your Guess: 1234, Code: 7249<br />
									<strong>C: 1</strong> (because only digit "2" is in the correct position)
								</div>
							</div>
						</div>
					</li>

					<li class="bg-gray-50 rounded-lg p-4 sm:p-6 w-full">
						<h3 class="text-base sm:text-xl font-semibold text-blue-700 mb-2">3. Winning Condition</h3>
						<p class="text-gray-700">
							Getting <span class="font-bold text-green-700">C: 4</span> means you have correctly guessed the code and won the game!
						</p>
					</li>

					<li class="bg-gray-50 rounded-lg p-4 sm:p-6 w-full">
						<h3 class="text-base sm:text-xl font-semibold text-blue-700 mb-2">4. Game Over</h3>
						<p class="text-gray-700">
							If you don't guess the code within 10 attempts, the game ends and reveals the secret code.
						</p>
					</li>
				</ol>

				<div class="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mt-8">
					<h3 class="text-base sm:text-xl font-semibold text-green-700 mb-2">💡 Strategy Tips</h3>
					<ul class="text-left space-y-2 text-gray-700 text-sm">
						<li>• Start with a systematic approach (e.g., 1234, then 5678)</li>
						<li>• Use the Exists and Correct values to eliminate possibilities</li>
						<li>• Remember: no digit repeats in the secret code</li>
						<li>• Pay attention to which digits you've already tried</li>
					</ul>
				</div>
			</div>
		</div>
	</main>
</div>
