<script>
    import { scoreStore } from '$lib/stores/score';
    import Header from '$lib/components/Header.svelte';
    import Edetabel from '$lib/components/Edetabel.svelte';
    import { writeCustomScore, writeScore } from '$lib/supabase';

    export let data;
    let { scores, id } = data;
    
    let score = 0
    let newScore = null
    scoreStore.subscribe(value => score = value) // Mängitud mängu tulemus

    let scoreSubmitted = false
    let name = null

    // Tulemuse lisamine edetabelisse
    async function submitScore() {
        if (id == 'daily') {
            await writeScore("scores", {name: name, score: score})
        } else {
            await writeCustomScore("custom_scores", {name: name, score: score}, id)
        }
        scoreSubmitted = true
        newScore = score
    }
</script>

<Header showData={false} />

{#if !scoreSubmitted && score > 0}
<div class="flex w-full h-fit py-6 flex flex-col md:flex-row justify-center items-center gap-4">
    <input bind:value={name} type="text" class="border-2 border-white rounded-lg" placeholder="Nimi">
    <h1>Punktid: {score}</h1>
    <button on:click={submitScore} class="border-2 rounded-lg px-4 py-1 hover:bg-white hover:cursor-pointer hover:text-[#1e272e]">Lisa edetabelisse</button>
</div>
{/if}

{#key newScore}
<Edetabel scores={scores} />
{/key}