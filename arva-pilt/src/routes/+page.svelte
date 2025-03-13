<script>
    import { goto } from '$app/navigation'

    function goToGame() {
        goto("/game")
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
        <img class="md:w-64 md:h-64 w-48 h-48 animate-[spin_25s_linear_infinite]" src="./logo.png" alt="LOGO">
    </div>
    <div class="w-full md:w-1/2 text-xl text-white flex items-center justify-center text-center">
        <ul>
            <li on:click={goToGame}><h1>Mängi</h1></li>
            <li on:click={goToCreateGame}><h1>Loo mäng</h1></li>
            <li on:click={goToRules}><h1>Kuidas mängida?</h1></li>
            <li on:click={goToAddImage}><h1>Lisa pilt</h1></li>
        </ul>
    </div>
    
</div>


