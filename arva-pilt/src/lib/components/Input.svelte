<script>
    // Komponent andmete sisestamiseks
    // Kasutatakse pildi lisamisel ja mängu loomisel
    import Map from "./Map.svelte";
    import { uploadImage, writeNewImage } from "$lib/supabase";

    export let addImage = false // Selle parameetri abil vaadatakse, kummal lehel komponenti kasutatakse

    let ala = [[57.476035, 21.503336], [59.752687, 28.233382]] // Eraldab kaardilt Eesti
    let map
    let marker = null

    // Lähteandmed
    export let showForm = false
    export let rounds = []
    export let gameId
    let image = null
    let image_url = null
    let location = null
    let description = null
    let attribution = null
    let year = 1950
    let newRound = {}
    let imageData = {}

    export let uploadingImage = false
    export let imageAdded = false

    // Vooru lisamise tühistamine
    function cancelRound() { showForm = false }

    // Vooru lisamine
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
            fileInputText = "Vali pilt"
        } else {
            alert("Mõned väljad on täitmata!")
        }
    }

    // Pildi üleslaadimine andmebaasi
    async function sendImage() {
        if (image && location && description && attribution && year) {
            uploadingImage = true
            image_url = await uploadImage(image, 'new_images')

            imageData = {
                id: rounds.length+1,
                image_url: image_url,
                location: location,
                year: year,
                description: description,
                attribution: attribution
            }

            await writeNewImage(imageData)
            imageAdded = true

            image = null
            image_url = null
            location = null
            description = null
            attribution = null
            marker = null
            year = null
            showForm = false
            uploadingImage = false
            fileInputText = "Vali pilt"
        } else {
            alert("Mõned väljad on täitmata!")
        }
    }


    // Pildi haldamine
    let fileInputText = "Vali pilt"

    function handleFileChange() {
        image = event.target.files[0]
        fileInputText = image.name
    }
</script>



<div class="w-full h-fit {addImage ? '' : 'absolute'} top-0 left-0 bg-[#1e272e]">
    {#if uploadingImage}
    <div class="w-full h-screen flex justify-center items-center">
        <img src="./logo.png" alt="logo" class="animate-spin w-8 h-8">
    </div>
    {:else if imageAdded}
    <div class="w-full h-full grid place-items-center">
        <h1>Saime pildi kätte, aitäh!</h1>
    </div>
    {:else}
    <div class="w-full h-full grid md:grid-rows-2 md:grid-cols-2 grid-rows-4 grid-cols-1">
        <div class="w-full h-full p-6">
            <h1 class="text-xl mb-2">Pilt</h1>
            <div class="w-full h-fit py-12 flex justify-center items-center border border-white rounded-lg">
                <label for="file-upload" class="cursor-pointer">{fileInputText}</label>
                <input on:change={handleFileChange} id="file-upload" type="file" accept="image/*" class="hidden">
            </div>
        </div>
        <div class="w-full h-full p-6">
            <h1 class="text-xl mb-2">Asukoht</h1>
            <Map bind:marker={marker} bind:location={location} input={true} />
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
        {#if addImage}
        <button on:click={sendImage} class="w-24 border border-2 hover:border hover:border-2 hover:bg-[#26de81] hover:text-[#1e272e] cursor-pointer rounded-lg">Saada</button>
        {:else}
        <button on:click={cancelRound} class="w-24 border border-2 border-red hover:bg-red-400 hover:text-[#1e272e] cursor-pointer rounded-lg hover:border-none">Tühista</button>
        <button on:click={confirmRound} class="w-24 border border-2 hover:bg-[#26de81] hover:text-[#1e272e] cursor-pointer rounded-lg hover:border-none">Lisa</button>
        {/if}
    </div>
    {/if}
</div>

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