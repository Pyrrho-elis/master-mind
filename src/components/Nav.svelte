<script>
	import IoMdArrowRoundBack from 'svelte-icons/io/IoMdArrowRoundBack.svelte';
	import GoInfo from 'svelte-icons/go/GoInfo.svelte';
	import { page } from '$app/stores';

	let url = $page.url.pathname;
	console.log(url);
</script>

<div class="flex justify-between items-center w-screen text-gray-900 h-16 px-4 sm:px-6">
	{#if url == '/rules'}
		<a
			href="/"
			class="w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
			aria-label="Go back to game"
		>
			<IoMdArrowRoundBack />
		</a>
	{:else if url == '/'}
		<a
			href="/rules"
			class="w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
			aria-label="View game rules"
		>
			<GoInfo />
		</a>
	{/if}
	<h1 class="text-xl sm:text-2xl font-black">KrackTheKode</h1>
	<a
		href="https://t.me/PyrrhoOfElis"
		class="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
		aria-label="Contact developer on Telegram"
	>
		<img class="rounded-full w-full h-full object-cover" src="pyrr.jpg" alt="Developer avatar" />
	</a>
</div>
