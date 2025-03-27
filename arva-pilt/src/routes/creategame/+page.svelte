<script>
    import Header from "$lib/components/Header.svelte";
    import Input from "$lib/components/Input.svelte";
	import { writeCustomGame, writeCustomImage } from "$lib/supabase";
    import { nanoid } from "nanoid";
    import L from "leaflet";
	import { onMount } from "svelte";
   
    /*******************/
    //  Vooru lisamine //
    /*******************/ 

    let gameId = nanoid(8);

    let showForm = false
    let rounds = []

    let uploadingImage = false
    let creatingGame = false
    let gameCreated = false

    function addRound() { showForm = true } 

    async function createGame() {
        creatingGame = true
        await writeCustomGame(gameId)
        
        for (let i=0; i<rounds.length; i++) {
            await writeCustomImage(rounds[i], gameId)
        }
        creatingGame = false
        gameCreated = true
    }
</script>

<svelte:head>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
</svelte:head>

<Header showData={false} />
{#if creatingGame}
<div class="w-full h-full flex justify-center items-center">
    <img src="./logo.png" alt="logo" class="animate-spin w-8 h-8">
</div>
{:else if !gameCreated}
<div class="px-6">
    <h1 class="text-2xl mb-2">Loo mäng</h1>
    <p class="text-justify mb-4">
        Siin saad luua enda piltidega mängu. Uue vooru lisamiseks klõpsa nupul "Lisa voor" ja täida kõik väljad. Mängul saab olla maksimaalselt 5 vooru. Kui oled loodud voorudega rahul, siis klõpsa nupul "Loo mäng" ja saad koodi, millega on võimalik sinu loodud mängu mängida.
    </p>
</div>
<div class="flex w-full h-fit px-6 mb-4 gap-4 items-center">
    <button on:click={addRound} class="md:text-lg text-xs border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer md:w-36 w-24 h-fit rounded-lg flex justify-center items-center">Lisa voor‍🛠️</button>
</div>
<div class="w-full h-fit ">
    <ul class="flex w-full px-6 md:text-lg text-xs text-[#1e272e]">
        <li class="w-8 h-fit py-2 flex justify-center items-center"><p class="bg-white rounded-lg px-2">Nr</p></li>
        <ul class="flex w-full">
            <li class="w-1/5 h-fit py-2 flex justify-center items-center"><p class="bg-white rounded-lg px-2">Pilt</p></li>
            <li class="w-1/5 h-fit py-2 flex justify-center items-center"><p class="bg-white rounded-lg px-2">Asukoht</p></li>
            <li class="w-1/5 h-fit py-2 flex justify-center items-center"><p class="bg-white rounded-lg px-2">Aasta</p></li>
            <li class="w-1/5 h-fit py-2 flex justify-center items-center"><p class="bg-white rounded-lg px-2">Kirjeldus</p></li>
            <li class="w-1/5 h-fit py-2 flex justify-center items-center"><p class="bg-white rounded-lg px-2">Viide</p></li>
        </ul>
    </ul>
    {#each rounds as round}
    <ul class="flex w-full px-[2%]">
        <li class="w-8 h-18 py-2 flex justify-center items-center md:text-lg text-xs text-[#1e272e]"><p class="bg-white rounded-lg px-2">{round.id}</p></li>
        <ul class="flex w-full md:text-sm text-xs text-white text-center">
            <li class="w-1/5 h-18 flex p-2 flex justify-center items-center "><img src={round.image_url} alt="pildike" class="w-auto h-auto max-w-full max-h-full object-contain"></li>
            <li class="w-1/5 h-18 flex p-2 flex justify-center items-center break-all">{round.location}</li>
            <li class="w-1/5 h-18 flex p-2 flex justify-center items-center">{round.year}</li>
            <li class="w-1/5 h-18 flex p-2 flex justify-center items-center truncate break-all text-wrap">{round.description}</li>
            <li class="w-1/5 h-18 flex p-2 flex justify-center items-center truncate break-all text-wrap">{round.attribution}</li>
        </ul>
    </ul>
    {/each}
    {#if rounds.length > 0}
    <div class="w-full h-fit px-[2%] flex justify-center">
        <button on:click={createGame} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer mt-4 rounded-lg w-36 h-fit text-lg">Loo mäng💫</button>
    </div>
    {/if}
</div>
{:else}
<div class="w-full h-full flex justify-center items-center">
    <h1 class="text-2xl">Mäng loodud! Kood: {gameId}</h1>
</div>
{/if}

{#if showForm}
<Input bind:showForm={showForm} bind:rounds={rounds} gameId={gameId}/>
{/if}