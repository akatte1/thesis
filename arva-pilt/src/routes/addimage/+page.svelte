<script>
    // Leht piltide lisamiseks
    // Kasutab suures osas sisendi komponenti
    import Input from "$lib/components/Input.svelte";
    import Header from "$lib/components/Header.svelte";


    let imageAdded // Kas pilt on lisatud?
    let uploadingImage 
</script>

<svelte:head>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
</svelte:head>

<Header showData={false} />
{#if !imageAdded && !uploadingImage}
<div class="px-6">
    <h1 class="text-2xl mb-2">Lisa pilt</h1>
    <p class="text-justify">Siia saad lisada enda poolt mõne pildi, mida oleks võimalik mängus kasutada. Oluline on, et pilt oleks tehtud Eestis ning selle asukohta ja aastat oleks võimalik täpselt kindlaks teha. Eriti head pildid on sellised, mis pakuvad kasutajale mitmeid vihjeid, kuid ilmselgelt vastust ära ei anna. Kui pildiga käib kaasas mõni äge lugu, siis selle võib julgesti kirjelduse lahtrisse kirja panna. Kui pilt on ise tehtud siis võib viiteks panna näiteks Erakogu või enda nime. Kui pilt on aga veebist leitud, on väga oluline, et pildile saaks juurde viide originaalallikale.</p>
</div>
{/if}
<Input addImage={true} bind:imageAdded={imageAdded} bind:uploadingImage={uploadingImage} />