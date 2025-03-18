<script>
    import Header from "$lib/Header.svelte";
	import { uploadImage, writeCustomGame, writeCustomImage } from "$lib/supabase";
    import { nanoid } from "nanoid";
    import L from "leaflet";
	import { onMount } from "svelte";
   
    /**********/
    //  Kaart //
    /**********/ 
    let ala = [[57.476035, 21.503336], [59.752687, 28.233382]]
    let map
    let marker = null

    // Kaardi initsialiseerimine
    const initialView = [58.692947, 24.798119]
    function createMap(container) {
        let m = L.map(container, {preferCanvas: true }).setView(initialView, 7);
        L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
            attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
                &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
            subdomains: 'abcd',
            maxZoom: 16,
            minZoom: 5
            }
        ).addTo(m)

        // Muud alad halliks
        L.rectangle([[-90, ala[1][1]], [ala[1][0], 180]], {fillColor: "gray", fillOpacity: 0.6, weight: 0}).addTo(m);
        L.rectangle([[ala[1][0], ala[0][1]], [180, 180]], {fillColor: "gray", fillOpacity: 0.6, weight: 0}).addTo(m);
        L.rectangle([[ala[0][0], -180], [90, ala[0][1]]], {fillColor: "gray", fillOpacity: 0.6, weight: 0}).addTo(m);
        L.rectangle([[-90, -180], [ala[0][0], ala[1][1]]], {fillColor: "gray", fillOpacity: 0.6, weight: 0}).addTo(m);

        return m
    }

    function mapAction(container) {
        map = createMap(container)
        map.on('click', onMapClick);
    }

    function onMapClick(e) {
        if (inBounds(e.latlng["lat"], e.latlng["lng"])) {
            if (marker) {
                marker.setLatLng(e.latlng)
                location = [marker.getLatLng()["lat"], marker.getLatLng()["lng"]]
            } else {
                marker = L.marker(e.latlng).addTo(map)
                location = [marker.getLatLng()["lat"], marker.getLatLng()["lng"]]
            }
        }       
    }

    function inBounds(a, b) {
        if (a > ala[0][0] && a < ala[1][0] && b > ala[0][1] && b < ala[1][1]) return true
        return false
    }


    /*******************/
    //  Vooru lisamine //
    /*******************/ 

    let gameId = nanoid(8);

    let showForm = false
    let rounds = []
    let image = null
    let image_url = null
    let location = null
    let description = null
    let attribution = null
    let year = 1950
    let newRound = {}

    let uploadingImage = false
    let creatingGame = false
    let gameCreated = false

    function addRound() { showForm = true } 

    function cancelRound() { showForm = false }

    async function confirmRound() {
        if (image && location && description && attribution && year) {
            uploadingImage = true
            image_url = await uploadImage(image, gameId)

            newRound = {
                id: rounds.length+1,
                image_url: image_url,
                location: location,
                year: year,
                description: description,
                attribution: attribution
            }
            rounds = [...rounds, newRound]

            image = null
            image_url = null
            location = null
            description = null
            attribution = null
            marker = null
            year = null
            showForm = false
            uploadingImage = false
        } else {
            alert("Mõned väljad on täitmata!")
        }
    }


    // Pildi haldamine

    function handleFileChange() {
        image = event.target.files[0]

    }


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
<h1 class="text-2xl flex justify-center">Uus mäng</h1>
<div class="flex w-full h-fit px-[2%] mb-4 gap-4 items-center">
    <button on:click={addRound} class="text-lg border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer w-36 h-fit rounded-lg flex justify-center items-center">Lisa voor +</button>
</div>
<div class="w-full h-fit">
    <ul class="flex w-full px-[2%]">
        <li class="w-8 h-fit py-2 flex justify-center items-center border border-1 border-white">Nr</li>
        <ul class="flex w-full">
            <li class="w-1/5 h-fit py-2 flex justify-center items-center border border-1 border-white">Pilt</li>
            <li class="w-1/5 h-fit py-2 flex justify-center items-center border border-1 border-white">Asukoht</li>
            <li class="w-1/5 h-fit py-2 flex justify-center items-center border border-1 border-white">Aasta</li>
            <li class="w-1/5 h-fit py-2 flex justify-center items-center border border-1 border-white">Kirjeldus</li>
            <li class="w-1/5 h-fit py-2 flex justify-center items-center border border-1 border-white">Viide</li>
        </ul>
    </ul>
    {#each rounds as round}
    <ul class="flex w-full px-[2%]">
        <li class="w-8 h-18 flex justify-center items-center border border-1 border-white">{round.id}</li>
        <ul class="flex w-full justify-between">
            <li class="w-1/5 h-18 flex p-2 text-md flex justify-center items-center border border-1 border-white"><img src={round.image_url} alt="pildike" class="w-auto h-auto max-w-full max-h-full object-contain"></li>
            <li class="w-1/5 h-18 flex p-2 text-md text-wrap border border-1 border-white"><p class="break-all">{round.location}</p></li>
            <li class="w-1/5 h-18 flex p-2 text-md text-wrap border border-1 border-white">{round.year}</li>
            <li class="w-1/5 h-18 flex p-2 text-md text-wrap border border-1 border-white">{round.description}</li>
            <li class="w-1/5 h-18 flex p-2 text-md text-wrap border border-1 border-white">{round.attribution}</li>
        </ul>
    </ul>
    {/each}
    {#if rounds.length > 0}
    <button on:click={createGame} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer mt-4 rounded-lg w-46">Loo mäng</button>
    {/if}
</div>
{:else}
<div class="w-full h-full flex justify-center items-center">
    <h1 class="text-2xl">Mäng loodud! Kood: {gameId}</h1>
</div>
{/if}

{#if showForm}
    <div class="w-full h-full p-8 absolute top-0 left-0">
        
        
        <div class="w-full h-fit bg-gray-700 rounded-lg">
            {#if uploadingImage}
            <div class="w-full h-screen flex justify-center items-center">
                <img src="./logo.png" alt="logo" class="animate-spin w-8 h-8">
            </div>
            {:else}
            <div class="w-full h-fit grid md:grid-rows-2 md:grid-cols-2 grid-rows-4 gird-cols-1">
                <div class="w-full h-full p-6">
                    <h1 class="text-xl mb-2">Pilt</h1>
                    <div class="w-full h-fit py-12 flex justify-center items-center border border-white rounded-lg">
                        <label for="file-upload">Vali fail</label>
                        <input on:change={handleFileChange} id="file-upload" type="file" accept="image/*" class="hidden">
                    </div>
                </div>
                <div class="w-full h-full p-6">
                    <h1 class="text-xl mb-2">Asukoht</h1>
                    <div id="map" use:mapAction class="rounded-md mb-4 cursor-crosshair! w-full h-full"></div>
                </div>
                <div class="w-full h-full p-6">
                    <h1 class="text-xl mb-2">Kirjeldus</h1>
                    <textarea bind:value={description} type="textarea" class="w-full h-28 flex justify-center items-center border border-white rounded-lg"></textarea>
                </div>
                <div class="w-full h-full p-6">
                    <h1 class="text-xl mb-2">Viide</h1>
                    <textarea bind:value={attribution} class="w-full h-28 flex justify-center items-center border border-white rounded-lg"></textarea>
                </div>
                <div class="w-full h-full p-6">
                    <h1 class="text-xl mb-2">Aasta</h1>
                    <h1 class="text-lg">{year}</h1>
                    <input bind:value={year} type="range" min=1890 max=2025 class="w-full" id="year-select">
                </div>
            </div>
            <div class="w-full h-fit p-6 flex gap-6 justify-end">
                <button on:click={cancelRound} class="w-24 border border-2 border-red hover:bg-red-400 hover:text-[#1e272e] cursor-pointer rounded-lg hover:border-none">Tühista</button>
                <button on:click={confirmRound} class="w-24 border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer rounded-lg hover:border-none">Lisa</button>
            </div>
            {/if}
        </div>
    </div>
{/if}


<style>

#year-select {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
}

#year-select::-webkit-slider-runnable-track {
  background: white;
  height: 0.1rem;
}

#year-select::-webkit-slider-thumb {
   -webkit-appearance: none;
   appearance: none;
   margin-top: -1rem;
   height: 2rem;
   width: 2rem;
   border-radius: 1rem;
   border-color: white;
   border: solid;    
}

</style>