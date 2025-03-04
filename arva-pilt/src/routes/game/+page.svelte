<script>
    import { getAllImages } from "$lib/supabase";
    import L from "leaflet";
    import { onMount } from "svelte";

    // Andmete laadimine
    let images = []

    let isLoading = true
    onMount(async () => {
        images = await getAllImages("images")
        console.log(images)
        isLoading = false
    })    

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
    const initialView = [58.692947, 25.825512]
    function createMap(container) {
        let m = L.map(container, {preferCanvas: true }).setView(initialView, 6);
        L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
            attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
                &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
            subdomains: 'abcd',
            maxZoom: 14,
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
            } else {
                marker = L.marker(e.latlng).addTo(map)
                selected = true
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

    // Uus pilt
    function advanceImage() {
        guessed = false
        selected = false
        map.removeLayer(marker)
        map.removeLayer(correctMarker)
        correctMarker = null
        marker = null
        distance = null
        counter++
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
    width: 300px;
    height: 40px;
}
</style>

<svelte:head>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
</svelte:head>

{#if isLoading}
Loading...
{:else}

<div class="flex">
    <div class="w-1/2">
        {#key counter}
        <img src={images[counter-1]["image_path"]} alt="pilt" class="image"/>
        {/key}

        {#if guessed}
        <div class="w-full">
            <p>{images[counter-1]["description"]}</p>
        </div>
        {/if}
    </div>
    <div class="w-1/2">
        <div id="map" use:mapAction></div>

        {#if !guessed}
        <div class="flex">
            <h2 class="border p-xs">{year}</h2>
            <input bind:value={year} type="range" min=1890 max=2025 class="w-full">
        </div>
        {:else}
        <div>
            <h3>Kaugus õigest asukohast: {distance} km</h3>
            <h3>Pakutud aasta: {year} Õige aasta: {images[counter-1]["year"]}</h3>
            <h3>Punktid</h3>
            <div class="flex">
                <h3>Kaugus: {distancePoints}</h3>
                <h3>Aastaarv: {timePoints}</h3>
                <h3>Kokku: {distancePoints + timePoints}</h3>
            </div>
        </div>
        {/if}

        {#if !selected}
            <button class="disabled">Vali asukoht</button>
        {:else}
            {#if !guessed}
            <button on:click={makeGuess}>Arva</button>
            {:else}
            <button on:click={advanceImage}>Edasi</button>
            {/if}
        {/if}
    </div>
</div>


{/if}


