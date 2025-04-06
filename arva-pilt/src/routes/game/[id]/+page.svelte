<script>
    import { getAllRows } from "$lib/supabase";
    import { scoreStore } from '$lib/stores/score';
    import { goto } from '$app/navigation';
    import { onDestroy, onMount } from "svelte";
    import Header from "$lib/components/Header.svelte";
    import Image from "$lib/components/Image.svelte";
    import Map from "$lib/components/Map.svelte";

    // Andmete laadimine
    export let data;
    let { images, id } = data;

    let isLoading = false

    // Kaart
    let map
    let marker = null
    let correctMarker = null
    let correctLocation = null

    // Arvamine
    let year = 1950
    let selected = false
    let guessed = false
    let distance = null
    let timePoints = null
    let distancePoints = null
    export let totalPoints = 0

    let counter = 1

    // Pakkumise sisestamisel tehtavad protseduurid
    function makeGuess() {
        guessed = true
        correctLocation = [images[counter-1]["latitude"], images[counter-1]["longitude"]]
        map.makeGuess()
        distance = calculateDistance(marker.getLatLng()["lat"], marker.getLatLng()["lng"], correctMarker.getLatLng()["lat"], correctMarker.getLatLng()["lng"])
        distance = Math.round(distance * 100) / 100 // Ümardamine
        timePoints = timeToPoints(Math.abs(year-images[counter-1]["year"]))
        distancePoints = distanceToPoints(distance)
        totalPoints += timePoints + distancePoints
    }

    // Õige ja pakutud punktide vahelise kauguse arvutamine
    function calculateDistance(lat1, lon1, lat2, lon2) {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var l1 = toRad(lat1);
      var l2 = toRad(lat2);


      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(l1) * Math.cos(l2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Teisaldab kraadid radiaanideks
    function toRad(Value) { return Value * Math.PI / 180; }

    //*****************/
    // Edasi liikumine /
    //*****************/

    // Uus pilt
    function advanceImage() {
        guessed = false // Andmete lähtestamine
        correctMarker = null
        correctLocation = null
        marker = null
        distance = null
        year = 1950
        counter++
    }

    // Lõpp
    function advance() {
        map.advance()
        if (counter == images.length) {
            scoreStore.set(totalPoints)
            goto(`/leaderboard/${id}`)
        } else {
            advanceImage()
        }
    }

    // Demo
    function goToRules() {
        goto("/rules")
    }

    // Kauguse punktid
    function distanceToPoints(a) {
        if (a-1 > 0) return a > 100 ? 0 : Math.round(5000 - (a-1)*50) 
        return 5000
    }

    // Aastaarvu punktid
    function timeToPoints(a) {
        return a > 50 ? 0 : 5000-(a*100)
    }
</script>




<svelte:head>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
</svelte:head>

<Header points={totalPoints} counter={counter} maxRounds={images.length}/>

{#if isLoading}
Loading...
{:else}

<div class="flex md:flex-row flex-col w-full h-full">
    <div class="w-full md:w-1/2 px-6 py-2">
        {#key counter}
        <div class="w-full h-96 flex items-center justify-center mb-4">
            <Image source={images[counter-1]["image_path"]} />
        </div>
        {/key}

        {#if guessed}
        <div class="w-full h-1/4">
            <p class="mb-4">{images[counter-1]["description"]}</p>
            <p class="text-xs">{images[counter-1]["attribution"]}</p>
        </div>
        {/if}
    </div>
    <div class="w-full md:w-1/2 px-6 py-2">
        <Map bind:this={map} bind:marker={marker} bind:correctMarker={correctMarker} bind:correctLocation={correctLocation} bind:guessed={guessed} />

        {#if !guessed}
        <div class="flex gap-4 mb-4">
            <div class="w-24 h-fit">
                <h1 class="text-3xl">{year}</h1>
            </div> 
            <input bind:value={year} type="range" min=1890 max=2025 class="w-full" id="year-select">
        </div>
        {:else}
        <div class="mb-4">
            <h3>Kaugus õigest asukohast: {distance} km</h3>
            <div class="flex flex-col md:flex-row md:gap-4 mb-4">
                <h3>Pakutud aasta: {year}</h3>
                <h3>Õige aasta: {images[counter-1]["year"]}</h3>
            </div>
            <div class="flex flex-col gap-4 md:flex-row justify-between">
                <div class="flex gap-2">
                    <h3>Kaugus: </h3>
                    <div class="h-fit w-12 p-.5 bg-white text-[#1e272e] flex justify-center rounded-md">{distancePoints}</div>
                </div>
                <div class="flex gap-2">
                    <h3>Aastaarv: </h3>
                    <div class="h-fit w-12 p-.5 bg-white text-[#1e272e] flex justify-center rounded-md">{timePoints}</div>
                </div>
                <div class="flex gap-2">
                    <h3>Kokku: </h3>
                    <div class="h-fit w-12 p-.5 bg-white text-[#1e272e] flex justify-center rounded-md">{distancePoints + timePoints}</div>
                </div>
            </div>
        </div>
        {/if}

        <div class="w-full h-fit flex justify-end">
            {#if !marker}
            <button class="cursor-not-allowed bg-gray-700">Vali asukoht</button>
            {:else}
                {#if !guessed}
                <button on:click={makeGuess} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer">Arva</button>
                {:else if id=='demo'}
                <button on:click={goToRules} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer">Tagasi</button>
                {:else}
                <button on:click={advance} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer">Edasi</button>
                {/if}
            {/if}

        </div>
        
    </div>
</div>
{/if}

<style>
    button {
        width: 12rem;
        height: fit-content;
        padding-block: .5rem;
        border-radius: var(--radius-md);
    }
    
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


