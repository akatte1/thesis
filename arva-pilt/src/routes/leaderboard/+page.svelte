<script>
    import { scoreStore } from '$lib/stores/score';
    import Header from '$lib/Header.svelte';
    import Edetabel from '$lib/Edetabel.svelte';
    import { writeScore } from '$lib/supabase';
    
    let score = 0
    let newScore = null
    scoreStore.subscribe(value => score = value)

    let scoreSubmitted = false
    let name = null

    function submitScore() {
        writeScore("scores", {name: name, score: score})
        scoreSubmitted = true
        newScore = score
    }
</script>

<Header showData={false} />

{#if !scoreSubmitted}
<div class="flex w-full h-fit py-6 flex flex-col md:flex-row justify-center items-center gap-4">
    <input bind:value={name} type="text" class="border-2 border-white rounded-lg" placeholder="Nimi">
    <h1>Punktid: {score}</h1>
    <button on:click={submitScore} class="border-2 rounded-lg px-4 py-1 hover:bg-white hover:cursor-pointer hover:text-[#1e272e]">Lisa edetabelisse</button>
</div>
{/if}

{#key newScore}
<Edetabel />
{/key}