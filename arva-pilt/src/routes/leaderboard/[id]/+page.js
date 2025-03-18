import { getAllRows, getCustomScores, supabase } from '$lib/supabase'

export async function load({ params }) {
    const { id } = params;

    let scores = []

    if (id == 'daily') {
        console.log("daily")
        scores = await getAllRows("scores")
    } else {
        scores = await getCustomScores(id)
    }
  
    return { scores, id };
}