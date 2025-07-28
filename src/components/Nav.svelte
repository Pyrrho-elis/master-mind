<script>
	import IoMdArrowRoundBack from 'svelte-icons/io/IoMdArrowRoundBack.svelte';
	import GoInfo from 'svelte-icons/go/GoInfo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { page } from '$app/stores';

	let url = $page.url.pathname;
</script>

<nav class="navbar sticky top-0 z-50 w-full">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Left side -->
			<div class="flex items-center space-x-4">
				{#if url == '/rules'}
					<a
						href="/"
						class="navbar-button w-10 h-10 flex items-center justify-center rounded-lg"
						aria-label="Go back to game"
					>
						<IoMdArrowRoundBack class="w-5 h-5" />
					</a>
				{:else if url == '/'}
					<a
						href="/rules"
						class="navbar-button w-10 h-10 flex items-center justify-center rounded-lg"
						aria-label="View game rules"
					>
						<GoInfo class="w-5 h-5" />
					</a>
				{/if}
				<h1 class="navbar-title text-xl sm:text-2xl">KrackTheKode</h1>
			</div>
			
			<!-- Right side -->
			<div class="flex items-center space-x-3">
				<ThemeToggle />
				<a
					href="https://t.me/PyrrhoOfElis"
					class="navbar-button w-10 h-10 flex items-center justify-center rounded-full overflow-hidden"
					aria-label="Contact developer on Telegram"
				>
					<img class="w-full h-full object-cover" src="pyrr.jpg" alt="Developer avatar" />
				</a>
			</div>
		</div>
	</div>
</nav>
