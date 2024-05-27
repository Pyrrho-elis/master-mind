<script src="$lib/confetti.MIDIInput.js">
	import { onMount } from 'svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { toast } from '@zerodevx/svelte-toast';
	import IoMdArrowRoundBack from 'svelte-icons/io/IoMdArrowRoundBack.svelte';
	import Nav from '../../cpmnts/Nav.svelte';
</script>

<div class="flex flex-col h-auto items-center bg-black text-white">
	<Nav />
	<div class="flex flex-col gap-4 text-center">
		<h1 class="text-2xl font-bold">How To Play</h1>

		<ol class="flex flex-col gap-2 justify-center items-center mb-10" type="1">
			<li>
				<p class="text-xl font-semibold">1. Make A Guess</p>
				<p class="w-96">
					Enter any 4-digit number as your guess. Each digit can be from 0 to 9, and digits can
					repeat.
				</p>
			</li>
			<li class="max-w-96">
				<p class="text-xl font-semibold">2. Use Info To Get The Correct Code</p>
				<p class="w-96">
					After submitting, you will receive two pieces of information that will help you narrow
					down the correct code:
				</p>
				<ul class="max-w-96">
					<li class="bg-white text-black mt-4">Column E</li>
					<li>
						This column tells you how many of the digits in your guess exist somewhere in the secret
						code, regardless of their position.
					</li>
					<li>e.g. Your Guess: 1234, Code: 7249</li>
					<li>E: 2 (because 2 of the digits exist in the code: 2 and 4)</li>
					<li class="bg-white text-black mt-4">Column C</li>
					<li>
						This column indicates how many of the digits that are present in the secret code (as
						identified in column "E") are also in the correct position.
					</li>
					<li>e.g. Your Guess: 1234, Code: 7249</li>
					<li>C: 1 (because only the digit "2" matches with the code)</li>
				</ul>
			</li>
			<li class="max-w-96">
				<p class="text-xl font-semibold">4. Winning</p>
				<p>
					Getting a 4 on both columns (E and C) means you have correctly guessed the code.
				</p>
			</li>
		</ol>
	</div>
</div>
