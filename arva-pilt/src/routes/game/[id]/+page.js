import { getCustomImages, getDailyImages, supabase } from '$lib/supabase'

// ChatGPT'ga loodud funktsioon suvaliste arvude leidmiseks
function getRandomNumbers(count, min, max) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.push(randomNum);
    }
    return numbers;
  }

// Laadib sisse pildid, millega mängitakse
export async function load({ params }) {
    const { id } = params;
    console.log(id)

    let images = []
    let ids = getRandomNumbers(5, 1, 200)
    console.log(ids)

    if (id == 'daily') {
        images = await getDailyImages(ids)
    } else {
        images = await getCustomImages(id)
    }
  
    return { images, id };
}
