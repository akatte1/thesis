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

    .logo-container {
        height: 100%;
        width: 50%;
    }

    .menu-container {
        height: 100%;
        width: 50%;
        font-size: x-large;
        color: white;
    }

    li {
        margin: 1rem;
        cursor: pointer;
    }

    li:hover {
        text-decoration: underline;
    }

    #logo {
        width: 18rem;
        height: 18rem;
    }
</style>

<div class="container flex">
    <div class="logo-container flex items-center justify-center">
        <img id="logo" src="./logo.png" alt="LOGO" class="animate-[spin_25s_linear_infinite]">
    </div>
    <div class="menu-container flex items-center justify-center text-center">
        <ul>
            <li on:click={goToGame}><h1>Mängi</h1></li>
            <li on:click={goToCreateGame}><h1>Loo mäng</h1></li>
            <li on:click={goToRules}><h1>Kuidas mängida?</h1></li>
            <li on:click={goToAddImage}><h1>Lisa pilt</h1></li>
        </ul>
    </div>
    
</div>


