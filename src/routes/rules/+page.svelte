<script src="$lib/confetti.MIDIInput.js">
	import { onMount } from 'svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { toast } from '@zerodevx/svelte-toast';
	import IoMdArrowRoundBack from 'svelte-icons/io/IoMdArrowRoundBack.svelte';
	import Nav from '../../components/Nav.svelte';
</script>

<div class="flex-1 flex-col min-h-screen items-center bg-black text-white">
	<Nav />
	<div class="flex flex-col gap-6 text-center max-w-2xl mx-auto px-6 py-8">
		<h1 class="text-4xl font-bold text-green-400 mb-4">How To Play KrackTheKode</h1>

		<div class="bg-gray-900 rounded-lg p-6 mb-6">
			<h2 class="text-2xl font-semibold text-yellow-400 mb-4">Objective</h2>
			<p class="text-lg">
				Guess the secret 4-digit code in as few attempts as possible. You have a maximum of 10
				attempts to crack the code!
			</p>
		</div>

		<ol class="flex flex-col gap-6 justify-center items-center">
			<li class="bg-gray-900 rounded-lg p-6 w-full max-w-lg">
				<h3 class="text-xl font-semibold text-blue-400 mb-3">1. Make A Guess</h3>
				<p class="text-gray-300">
					Enter any 4-digit number as your guess. Each digit must be unique (no repeating digits
					allowed).
				</p>
			</li>

			<li class="bg-gray-900 rounded-lg p-6 w-full max-w-lg">
				<h3 class="text-xl font-semibold text-blue-400 mb-3">2. Understand The Feedback</h3>
				<p class="text-gray-300 mb-4">
					After submitting, you'll receive two pieces of information to help you narrow down the
					correct code:
				</p>

				<div class="space-y-4">
					<div class="bg-white text-black p-4 rounded-lg">
						<h4 class="font-bold text-lg mb-2">Column E (Exists)</h4>
						<p class="text-sm">
							How many digits from your guess exist somewhere in the secret code, regardless of
							position.
						</p>
						<div class="mt-2 p-2 bg-gray-100 rounded">
							<strong>Example:</strong> Your Guess: 1234, Code: 7249<br />
							<strong>E: 2</strong> (because digits 2 and 4 exist in the code)
						</div>
					</div>

					<div class="bg-white text-black p-4 rounded-lg">
						<h4 class="font-bold text-lg mb-2">Column C (Correct Position)</h4>
						<p class="text-sm">
							How many digits are in the correct position (this is always ≤ the number in column E).
						</p>
						<div class="mt-2 p-2 bg-gray-100 rounded">
							<strong>Example:</strong> Your Guess: 1234, Code: 7249<br />
							<strong>C: 1</strong> (because only digit "2" is in the correct position)
						</div>
					</div>
				</div>
			</li>

			<li class="bg-gray-900 rounded-lg p-6 w-full max-w-lg">
				<h3 class="text-xl font-semibold text-blue-400 mb-3">3. Winning Condition</h3>
				<p class="text-gray-300">
					Getting <strong class="text-green-400">C: 4</strong> means you have correctly guessed the code
					and won the game!
				</p>
			</li>

			<li class="bg-gray-900 rounded-lg p-6 w-full max-w-lg">
				<h3 class="text-xl font-semibold text-blue-400 mb-3">4. Game Over</h3>
				<p class="text-gray-300">
					If you don't guess the code within 10 attempts, the game ends and reveals the secret code.
				</p>
			</li>
		</ol>

		<div class="bg-green-900 rounded-lg p-6 mt-6">
			<h3 class="text-xl font-semibold text-green-400 mb-2">💡 Strategy Tips</h3>
			<ul class="text-left space-y-2 text-gray-300">
				<li>• Start with a systematic approach (e.g., 1234, then 5678)</li>
				<li>• Use the E and C values to eliminate possibilities</li>
				<li>• Remember: no digit repeats in the secret code</li>
				<li>• Pay attention to which digits you've already tried</li>
			</ul>
		</div>
	</div>
</div>
