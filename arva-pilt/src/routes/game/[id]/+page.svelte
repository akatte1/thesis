<script>
    import { getAllRows } from "$lib/supabase";
    import { scoreStore } from '$lib/stores/score';
    import { goto } from '$app/navigation';
    import L from "leaflet";
    import { onMount } from "svelte";
    import Header from "$lib/Header.svelte";
    import Image from "$lib/Image.svelte";

    // Andmete laadimine
    export let data;
    let { images, id } = data;

    let isLoading = false


    /*
    onMount(async () => {
        images = await getAllImages("images")
        console.log(images)
        isLoading = false
    })   
    */ 
    

    // Kaart
    let ala = [[57.476035, 21.503336], [59.752687, 28.233382]]
    let map
    let marker = null
    let correctMarker = null

    // Arvamine
    let year = 1950
    let selected = false
    let guessed = false
    let distance = null
    let timePoints = null
    let distancePoints = null
    export let totalPoints = 0

    let counter = 1

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
        if (inBounds(e.latlng["lat"], e.latlng["lng"]) && !guessed) {
            if (marker) {
                
                marker.setLatLng(e.latlng)
            } else {
                marker = L.marker(e.latlng).addTo(map)
            }
        }       
    }

    function inBounds(a, b) {
        if (a > ala[0][0] && a < ala[1][0] && b > ala[0][1] && b < ala[1][1]) return true
        return false
    }

    // Game logic
    function makeGuess() {
        guessed = true
        let correctLocation = [images[counter-1]["latitude"], images[counter-1]["longitude"]]
        console.log(correctLocation)
        correctMarker = L.marker(correctLocation).addTo(map)
        correctMarker._icon.classList.add("correctMarker")
        distance = calculateDistance(marker.getLatLng()["lat"], marker.getLatLng()["lng"], correctMarker.getLatLng()["lat"], correctMarker.getLatLng()["lng"])
        distance = Math.round(distance * 100) / 100 // Ümardamine
        timePoints = timeToPoints(Math.abs(year-images[counter-1]["year"]))
        distancePoints = distanceToPoints(distance)
        totalPoints += timePoints + distancePoints
    }

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

    // Converts numeric degrees to radians
    function toRad(Value) { return Value * Math.PI / 180; }

    // Edasi liikumine

    // Uus pilt
    function advanceImage() {
        guessed = false
        map.removeLayer(marker)
        map.removeLayer(correctMarker)
        correctMarker = null
        marker = null
        distance = null
        counter++
    }

    // Lõpp
    function advance() {
        if (counter == 5) {
            scoreStore.set(totalPoints)
            goto(`/leaderboard/${id}`)
        } else {
            advanceImage()
        }
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


<style>
#map { height: 300px; width: 100%;}

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

<svelte:head>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
</svelte:head>

<Header points={totalPoints} counter={counter} />

{#if isLoading}
Loading...
{:else}

<div class="flex md:flex-row flex-col w-full h-full">
    <div class="w-full md:w-1/2 px-6 py-2">
        {#key counter}
        <div class="w-full h-96 flex items-center justify-center">
            <Image source={images[counter-1]["image_path"]} />
        </div>
        {/key}

        {#if guessed}
        <div class="w-full h-1/4">
            <p>{images[counter-1]["description"]}</p>
        </div>
        {/if}
    </div>
    <div class="w-full md:w-1/2 px-6 py-2">
        <div id="map" use:mapAction class="rounded-md mb-4 cursor-crosshair!"></div>

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
                {:else}
                <button on:click={advance} class="border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer">Edasi</button>
                {/if}
            {/if}

        </div>
        
    </div>
</div>


{/if}


