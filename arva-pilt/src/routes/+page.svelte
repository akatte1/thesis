<script>
    import { goto } from '$app/navigation'
    import Header from '$lib/Header.svelte'

    

    function goToDailyGame() {
        goto("/game/daily")
    }

    function goToCustomGame(gameId) {
        goto(`/game/${gameId}`)
    }

    function goToCreateGame() {
        goto("/creategame")
    }

    function goToRules() {
        goto("/rules")
    }

    function goToAddImage() {
        goto("/addimage")
    }

    let showPopup = false
    let customGame = false
    let gameId = null

    function manageGame() {
        showPopup = true
    }

    function manageCustomGame() {
        customGame = true
    }

    function closePopup() {
        showPopup = false
        customGame = false
    }


</script>

<style>
    .container {
        width: 100vw;
        height: 100vh;
        max-width: 1920px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6rem;
    }


    li {
        margin: 1rem;
        cursor: pointer;
    }

    li:hover {
        text-decoration: underline;
    }
</style>

<div class="container flex flex-col md:flex-row">
    <div class="w-full md:w-1/2 flex items-center justify-center">
        <img class="md:w-64 md:h-64 w-48 h-48 animate-[spin_25s_linear_infinite_reverse]" src="./logo.png" alt="LOGO">
    </div>
    <div class="w-full md:w-1/2 text-xl text-white flex items-center justify-center text-center">
        <ul>
            <li on:click={manageGame}><h1>Mängi</h1></li>
            <li on:click={goToCreateGame}><h1>Loo mäng</h1></li>
            <li on:click={goToRules}><h1>Kuidas mängida?</h1></li>
            <li on:click={goToAddImage}><h1>Lisa pilt</h1></li>
        </ul>
    </div>    
</div>

{#if showPopup}
<div class="w-full h-full flex justify-center items-center gap-12 absolute top-0 left-0 bg-[#1e272e]">
    <img src="./logo.png" alt="logo" on:click={closePopup} class="cursor-pointer fixed top-8 left-8 w-8 h-8">
    {#if !customGame}
    <button on:click={goToDailyGame} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer rounded-lg w-48 h-fit py-2 text-lg">Päevamäng</button>
    <button on:click={manageCustomGame} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer rounded-lg w-48 h-fit py-2 text-lg">Liitu koodiga</button>
    {:else}
    <label for="gamecode" class="text-xl">Sisesta kood:</label>
    <input bind:value={gameId} type="text" id="gamecode" class="border border-2 rounded-lg border-white">
    <button on:click={goToCustomGame(gameId)} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer rounded-lg w-48 h-fit py-2 text-lg">Mängima</button>
    {/if}
</div>
{/if}


