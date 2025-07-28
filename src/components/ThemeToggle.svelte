<script>
	import { onMount } from 'svelte';
	import IoMdSunny from 'svelte-icons/io/IoMdSunny.svelte';
	import IoMdMoon from 'svelte-icons/io/IoMdMoon.svelte';

	let isDark = false;

	const toggleTheme = () => {
		isDark = !isDark;
		document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	};

	onMount(() => {
		// Check for saved theme preference or default to light mode
		const savedTheme = localStorage.getItem('theme') || 'light';
		isDark = savedTheme === 'dark';
		document.documentElement.setAttribute('data-theme', savedTheme);
	});
</script>

<button
	on:click={toggleTheme}
	class="navbar-button w-10 h-10 flex items-center justify-center rounded-lg"
	aria-label="Toggle theme"
>
	{#if isDark}
		<IoMdSunny class="w-5 h-5 text-yellow-500" />
	{:else}
		<IoMdMoon class="w-5 h-5" />
	{/if}
</button> 