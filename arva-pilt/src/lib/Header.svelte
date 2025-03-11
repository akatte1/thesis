<script>
    import { goto } from '$app/navigation'

    function goToHome() {
        goto("/")
    }

    export let points = 0
    export let counter = 0
</script>

<div class="w-full h-18 flex justify-between p-6">
    <h1>{counter} / 5</h1>
    <img src="./logo.png" alt="logo" on:click={goToHome} class="cursor-pointer">
    <h1>{points}</h1>
</div>