<script>
	import IoMdArrowRoundBack from 'svelte-icons/io/IoMdArrowRoundBack.svelte';
    import GoInfo from 'svelte-icons/go/GoInfo.svelte'

	import { page } from '$app/stores';

    let url = $page.url.pathname
    console.log(url)
</script>

<div class="flex justify-between items-center w-screen text-white h-16">
    {#if url=="/rules"}    
	<a  href="/" class="w-[40px] h-[40px] m-6"><IoMdArrowRoundBack /></a>
    {/if}
    {#if url=="/"}
        <a href="/rules" class="w-[40px] h-[40px] m-6"> 
        <GoInfo /></a>
    {/if}
	<h1 class="text-2xl font-black">KrackTheCode</h1>
	<a href="https://t.me/PyrrhoOfElis" class="w-[50px] h-[50px] m-6"><img class=" rounded-full" src="pyrr.jpg" alt=""></a>
</div>
