<script>
    // Header komponent
    // Asub iga lehe ülaosas
    import { goto } from '$app/navigation'

    // Esilehele navigeerimine
    function goToHome() {
        goto("/")
    }

    export let points = 0 // Punktide muutuja
    export let counter = 0 // Vooru loendur
    export let showData = true // Kas näidata punkte ja vooru?
    export let maxRounds
</script>

<div class="w-full h-18 flex justify-between p-6">
    {#if showData}
    <h1>{counter} / {maxRounds}</h1>
    {/if}
    <img src="../logo.png" alt="logo" on:click={goToHome} class="cursor-pointer">
    {#if showData}
    <h1>{points}</h1>
    {/if}
</div>