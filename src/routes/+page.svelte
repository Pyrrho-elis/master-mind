<script src="$lib/confetti.MIDIInput.js">
	import SvelteOtp from '@k4ung/svelte-otp';
	import { onMount } from 'svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { toast } from '@zerodevx/svelte-toast';
	import GoInfo from 'svelte-icons/go/GoInfo.svelte';
	import Nav from '../cpmnts/Nav.svelte';
	import Analytics from './Analytics.svelte';

	let value = '';
	let err = '';
	let code = '';
	let score = [];
	let valid = false;
	let guess = 0;

	$: {
		handleInput(value);
		//console.log(valid);
	}


	const handleSolve = () => {
		if (value.length < 4) {
			toast.push(`<strong>Enter 4 Digits</strong>`, {
				theme: {
					'--toastColor': 'white',
					'--toastBackground': 'rgba(255, 13, 13, 0.2)',
					'--toastBarBackground': 'rgba(255, 13, 13, 0.5)'
				}
			});
		} else if (value.length == 4 && valid) {
			let correctSpot = 0;
			let exists = 0;
			for (let index in value) {
				//console.log(code[index])
				if (value[index] == code[index]) {
					correctSpot++;
					//console.log(score);
				}
				if (code.includes(value[index])) {
					exists++;
					//console.log(exists);
				}
			}
			score = [...score, { correctSpot: correctSpot, exists: exists }];
			correctSpot = 0;
			value = '';
			err = '';
			guess++;
		} else if (!valid) {
			toast.push(`<strong>Can't Use One Digit More Than Once</strong>`, {
				theme: {
					'--toastColor': 'white',
					'--toastBackground': 'rgba(255, 13, 13, 0.2)',
					'--toastBarBackground': 'rgba(255, 13, 13, 0.5)'
				}
			});
		}
	};

	const handleKeydown = (e) => {
		const key = e.key;
		if (!isNaN(key)) {
			if (value.length < 4) {
				value += key;
			}
		} else if (/[a-zA-Z]/.test(key)) {
			if (key == 'Enter') handleSolve();
			if (key == 'Backspace') value = value.slice(0, -1);
		} else {
			return;
		}
	};

	const handleInput = (input) => {
		const seenDigits = new Set();
		for (const digit of input) {
			if (seenDigits.has(digit)) {
				return (valid = false);
			}
			seenDigits.add(digit);
		}
		return (valid = true);
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
		code = generateUniqueNumbers().join('');
		//console.log(code);
		document.addEventListener('keydown', handleKeydown);
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
		<p class="text-white text-lg">Attempts: {guess}</p>

		{#each score as a}
			{#if a.exists == 4}
				{#if a.correctSpot == 4}
					<h1 class="text-2xl text-green-600">You Win!</h1>
				{/if}
			{/if}
		{/each}
		<SvelteOtp
			inputClass="rounded-md bg-gray-200"
			disableDefaultStyle="true"
			separatorClass="border-blue-700 text-3xl font-bold text-white"
			placeholder="****"
			separator="-"
			numberOnly
			numOfInputs={4}
			on:keydown={handleKeydown}
			bind:value
			on:input={handleInput}
		/>
		<button on:click={handleSolve} class="text-black my-4 rounded-lg p-2 bg-white">Submit</button>
		<div class="flex justify-between gap-10">
			<div class="text-white flex flex-col justify-center items-center">
				<h1 class="text-xl font-bold">E</h1>
				{#each score as a}
					<p class="text-white">
						{a.exists}
					</p>
				{/each}
			</div>
			<hr class="border-l-8 h-full w-[1px]" />
			<div class="text-white flex flex-col justify-center items-center">
				<h1 class="text-xl font-bold">C</h1>
				{#each score as a}
					<p class="text-white">
						{a.correctSpot}
					</p>
				{/each}
			</div>
		</div>
		<SvelteToast />
	</div>
</div>
