<script>
    import { onMount } from "svelte";
	import { getAllScores } from '$lib/supabase';

    let isLoading = true
    let scores = []
    onMount(async () => {
        scores = await getAllScores("scores")
        console.log(images)
        isLoading = false
    })    

</script>

<div class="w-full h-fit">
    <div class="w-full h-full flex justify-center mb-6 text-xl">
        <h1>Edetabel</h1>
    </div>
    <ul class="flex flex-col gap-2 justify-center px-20">
        {#each scores as score, index}
            <li class="flex gap-6 justify-center">
                <h1 class="w-4">{index+1}</h1>
                <h1 class="w-64">{score["name"]}</h1>
                <h1 class="w-12">{score["score"]}</h1>
            </li>
        {/each}
    </ul>
</div>