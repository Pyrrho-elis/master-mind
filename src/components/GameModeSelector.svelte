<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let selectedMode = 'daily';
	
	const gameModes = [
		{
			id: 'daily',
			name: 'Daily Challenge',
			description: 'One code per day, same for everyone',
			icon: '📅',
			featured: true
		},
		{
			id: 'practice',
			name: 'Practice Mode',
			description: 'Random codes, unlimited attempts',
			icon: '🎯',
			featured: false
		}
	];
	
	function selectMode(modeId) {
		selectedMode = modeId;
		dispatch('modeChange', { mode: modeId });
	}
</script>

<div class="game-mode-selector">
	<div class="text-center mb-6">
		<h2 class="text-xl sm:text-2xl font-bold mb-2 text-heading">Choose Game Mode</h2>
		<p class="text-sm text-body">Select how you want to play</p>
	</div>
	
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
		{#each gameModes as mode}
			<button
				on:click={() => selectMode(mode.id)}
				class="game-mode-card {selectedMode === mode.id ? 'selected' : ''} {mode.featured ? 'featured' : ''}"
			>
				<div class="flex items-center gap-3">
					<div class="text-2xl">{mode.icon}</div>
					<div class="text-left">
						<h3 class="font-semibold text-heading">{mode.name}</h3>
						<p class="text-sm text-body">{mode.description}</p>
					</div>
				</div>
				{#if mode.featured}
					<div class="featured-badge">Popular</div>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.game-mode-card {
		@apply relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer;
		background-color: var(--bg-card);
		border-color: var(--border-primary);
		color: var(--text-primary);
	}
	
	.game-mode-card:hover {
		border-color: var(--border-secondary);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}
	
	.game-mode-card.selected {
		border-color: #3b82f6;
		background-color: rgba(59, 130, 246, 0.05);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}
	
	.game-mode-card.featured {
		border-color: #f59e0b;
	}
	
	.game-mode-card.featured.selected {
		border-color: #3b82f6;
	}
	
	.featured-badge {
		@apply absolute -top-2 -right-2 px-2 py-1 text-xs font-semibold rounded-full;
		background-color: #f59e0b;
		color: white;
	}
	
	[data-theme="dark"] .game-mode-card.selected {
		background-color: rgba(59, 130, 246, 0.1);
	}
</style> 