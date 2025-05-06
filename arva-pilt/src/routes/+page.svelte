<script>
    // Esileht
    import { goto } from '$app/navigation'
    import Header from '$lib/components/Header.svelte'
    import { checkId } from '$lib/supabase'

    let showPopup = false
    let customGame = false
    let gameId = null
    let wrongId = false
    let checkingGame = false

    // Navigeerimine
    function goToDailyGame() {
        goto("/game/daily")
    }

    async function goToCustomGame() {
        checkingGame = true
        let gameExists = await checkId(gameId)
        if (gameExists) {
            goto(`/game/${gameId}`)
        } else {
            wrongId = true
        }
        checkingGame = false
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

<div class="container flex flex-col md:flex-row gap-6 md:gap-0 text-xl">
    <div class="w-full md:w-1/2 flex items-center justify-center">
        <img class="md:w-64 md:h-64 w-32 h-32 animate-[spin_25s_linear_infinite_reverse]" src="./logo.png" alt="LOGO">
    </div>
    <div class="w-full md:w-1/2 text-white flex items-center justify-center text-center">
        <ul>
            <li on:click={manageGame}><h1>Mängi</h1></li>
            <li on:click={goToCreateGame}><h1>Loo mäng</h1></li>
            <li on:click={goToRules}><h1>Kuidas mängida?</h1></li>
            <li on:click={goToAddImage}><h1>Lisa pilt</h1></li>
        </ul>
    </div>    
</div>

{#if showPopup}
<div class="w-full h-full flex flex-col md:flex-row justify-center items-center md:gap-12 gap-6 absolute top-0 left-0 bg-[#1e272e]">
    <img src="./logo.png" alt="logo" on:click={closePopup} class="cursor-pointer fixed top-6 left-6 w-6 h-6">
    {#if !customGame}
    <button on:click={goToDailyGame} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer rounded-lg w-48 h-fit py-2 text-lg">Päevamäng</button>
    <button on:click={manageCustomGame} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer rounded-lg w-48 h-fit py-2 text-lg">Liitu koodiga</button>
    {:else}
    <div class="flex flex-col gap-2">
        <label for="gamecode" class="text-xl">Kood:</label>
        <div class="flex gap-2 items-center">
            <input bind:value={gameId} type="text" id="gamecode" class="border border-2 rounded-lg border-white">
            {#if checkingGame}
            <img src="./logo.png" alt="logo" class="animate-spin w-6 h-6">
            {:else}
            <div class="w-6 h-6"></div>
            {/if}
        </div>
        {#if wrongId}
        <p class="text-sm text-red-700">Sellise koodiga mängu ei ole!</p>
        {/if}
    </div> 
    <button on:click={goToCustomGame} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer rounded-lg w-48 h-fit py-2 text-lg">Mängima</button>
    {/if}
</div>
{/if}

<style>
    .container {
        width: 100vw;
        height: 100vh;
        max-width: 1440px;
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


