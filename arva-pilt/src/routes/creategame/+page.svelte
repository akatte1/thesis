<script>
    import Header from "$lib/Header.svelte";
    import L from "leaflet";

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

    let showForm = false
    let rounds = []
    let image = null
    let location = null
    let description = null
    let attribution = null
    let newRound = {}

    function addRound() { showForm = true } 

    function cancelRound() { showForm = false }

    function confirmRound() {
        console.log("tere")
        console.log(location)
        console.log(image)
        if (image && location && description && attribution) {
            newRound = {
                id: rounds.length+1,
                image: image,
                location: location,
                description: description,
                attribution: attribution
            }
            rounds = [...rounds, newRound]

            image = null
            location = null
            description = null
            attribution = null
            marker = null
            showForm = false
        } else {
            alert("Mõned väljad on täitmata!")
        }
    }


    // Pildi haldamine

    function handleFileChange() {
        image = event.target.files[0]

    }

</script>

<svelte:head>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
</svelte:head>

<Header showData={false} />
<h1 class="text-2xl flex justify-center">Uus mäng</h1>
<div class="flex w-full h-fit px-[2%] mb-4 gap-4 items-center">
    <button on:click={addRound} class="text-2xl border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer w-8 h-8 rounded-lg flex justify-center items-center">+</button>
    <h1>Lisa voor</h1>
</div>
<div class="w-full h-fit">
    <ul class="flex w-full px-[2%]">
        <li class="w-8">Nr</li>
        <ul class="flex w-3/4 justify-between">
            <li>Pilt</li>
            <li>Asukoht</li>
            <li>Kirjeldus</li>
            <li>Viide</li>
        </ul>
    </ul>
    {#each rounds as round}
    <ul class="flex w-full px-[2%]">
        <li class="w-8">{round.id}</li>
        <ul class="flex w-3/4 justify-between">
            <li><img src={URL.createObjectURL(round.image)} alt="pildike"></li>
            <li>{round.location}</li>
            <li>{round.description}</li>
            <li>{round.attribution}</li>
        </ul>
    </ul>
    {/each}
</div>

{#if showForm}
    <div class="w-full h-full p-8 absolute top-0 left-0">
        <div class="w-full h-fit bg-gray-700 rounded-lg">
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
            </div>
            <div class="w-full h-fit p-6 flex gap-6 justify-end">
                <button on:click={cancelRound} class="w-24 border border-2 border-red hover:bg-red-400 hover:text-[#1e272e] cursor-pointer rounded-lg hover:border-none">Tühista</button>
                <button on:click={confirmRound} class="w-24 border border-2 hover:bg-white hover:text-[#1e272e] cursor-pointer rounded-lg hover:border-none">Lisa</button>
            </div>
        </div>
    </div>
{/if}


<style></style>