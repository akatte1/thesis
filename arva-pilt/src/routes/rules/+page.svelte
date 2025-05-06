<script>
    // Reeglid
    import Header from "$lib/components/Header.svelte";
    import { goto } from '$app/navigation'

    function goToDemo() {
        goto("/game/demo")
    }
</script>

<Header showData={false} />
<div class="px-6">
    <h1 class="text-2xl mb-2">Kuidas mängida?</h1>
    <div class="text-justify">
        <p class="mb-2">Mängu eesmärk on väga lihtne - kindlaks määrata antud pildi tegemise asukoht ja aasta. Asukoht tuleb valida kaardi pealt - marker tuleb panna täpselt sinna kohta, kus pilt on tehtud. Aastaarv tuleb valida vastava riba pealt.</p>    
        <p class="mb-2">Asukoha määramiseks on võimalik kasutada mitmeid erinevaid tunnuseid. Näiteks on linnapiltidel võimalik asukoha tuvastamiseks kasutada hooneid ja tänavaid ning loodusfotode puhul maastikku ja pinnavorme. Aastaarvu määramisel tulevad kasuks ajalooteadmised - kasulik on vaadata näiteks inimeste riietust või erinevaid esemeid näiteks autosid, fotoaparaate, telefone jms.</p>
        <p class="mb-2">Mängida saab nii päevamängu kui kasutajate poolt loodud mänge. Päevamäng, nagu nimi ütleb, on iga päev uus - pildipangast valitakse 5 uut pilti. Kasutajate loodud mängude mängimiseks on vaja teada koodi, mis antakse mängu loojale.</p>
        <p class="mb-2">Kui tahad proovida kuidas mäng käib, siis saad seda teha <span on:click={goToDemo} class="hover:bg-white hover:text-[#1e272e] cursor-pointer underline">siin.</span></p>
    </div>
</div>
