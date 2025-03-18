import { getAllImages, getCustomImages, supabase } from '$lib/supabase'

export async function load({ params }) {
    const { id } = params;
    console.log(id)

    let images = []

    if (id == 'daily') {
        console.log("daily")
        images = await getAllImages("images")
    } else {
        images = await getCustomImages(id)
    }
  
    return { images };
}
