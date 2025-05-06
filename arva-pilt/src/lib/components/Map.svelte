<script>
    // Kaardi komponent
    // Kasutatakse mitmes kohas
    import { onMount, onDestroy } from "svelte";
    export let marker
    export let location
    export let correctMarker
    export let correctLocation
    export let guessed
    export let input

    let map
    let ala = [[57.476035, 21.503336], [59.752687, 28.233382]] //Eesti

    onMount(async () => {
        const leaflet = await import("leaflet")
        mapAction('map')
    }) 

    onDestroy(() => {if (map) {map.remove()}})

    const initialView = [58.692947, 24.798119] // Kaardi keskkoht
    // Kaardi loomine vastavalt api dokumentatsioonile
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

    // Markeri asetamine kaardile
    function onMapClick(e) {
        if (inBounds(e.latlng["lat"], e.latlng["lng"]) && !guessed) {
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

    // Mängus kasutamiseks edasi liikumisel
    export function advance() {
        map.removeLayer(marker)
        map.removeLayer(correctMarker)
    }

    // Mängus kasutamiseks tulemuste näitamisel
    export function makeGuess() {
        correctMarker = L.marker(correctLocation).addTo(map)
    }

</script>


<div id="map" class="rounded-md mb-4 cursor-crosshair! w-full {input ? 'h-full' : 'h-[300px]'}"></div>