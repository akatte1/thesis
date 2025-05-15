import { createClient } from "@supabase/supabase-js";

//Serveri kood andmebaasi päringuteks

export const supabase = createClient(supabaseUrl, supabaseApiKey);

export async function getAllRows(table) {
    const {data, error} = await supabase.from(table).select("*")

    if (error) {
        console.log("error: ", error)
        return []
    }

    return data
}


/***************/
// Scores       /
/***************/


export async function writeScore(table, data) {
    const { error } = await supabase
            .from(table)
            .insert([{ name: data.name, score: data.score }]);

        if (error) {
            console.error(error);
        }
}

export async function writeCustomScore(table, data, gameId) {
    const { error } = await supabase
            .from(table)
            .insert([{ name: data.name, score: data.score, game_id: gameId }]);

        if (error) {
            console.error(error);
        }
}

export async function getCustomScores(gameId) {
    const {data, error} = await supabase.from('custom_scores').select("*").eq('game_id', gameId)

    if (error) {
        console.log("error: ", error)
        return []
    }

    return data
}

/***************/
// Images       /
/***************/

export async function uploadImage(file, gameId) {

    const filePath = `${gameId}/${Date.now()}_${file.name}`

    const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file)

    if (error) {
        console.error('Error uploading file:', error.message)
        return
    }

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    let imageUrl = publicUrlData.publicUrl
    return imageUrl
}



export async function writeCustomImage(round, gameId) {
    const { error } = await supabase
            .from('custom_images')
            .insert([{ 
                image_path: round.image_url,
                latitude: round.location[0],
                longitude: round.location[1],
                description: round.description,
                attribution: round.attribution,
                year: round.year,
                game_id: gameId
             }]);

        if (error) {
            message = 'Failed to submit image!';
            console.error(error);
        }
}

export async function writeNewImage(data) {
    const { error } = await supabase
    .from('new_images')
    .insert([{ 
        image_path: data.image_url,
        latitude: data.location[0],
        longitude: data.location[1],
        description: data.description,
        attribution: data.attribution,
        year: data.year,
     }]);

    if (error) {
        message = 'Failed to submit image!';
        console.error(error);
    }
}

export async function getCustomImages(gameId) {
    const {data, error} = await supabase.from('custom_images').select("*").eq('game_id', gameId)

    if (error) {
        console.log("error: ", error)
        return []
    }

    return data

}

export async function getDailyImages(ids) {
    const {data, error} = await supabase.from('images').select("*").in("id", ids)

    if (error) {
        console.log("error: ", error)
        return []
    }

    return data
}

/***************/
// Custom games /
/***************/

export async function writeCustomGame(gameId) {
    const { data, error } = await supabase
            .from('custom_games')
            .insert([{ nano_id: gameId }])
            .select("id")

        if (error) {
            message = 'Failed to create game!';
            console.error(error);
        }
}

export async function checkId(id) {
    const { data, error } = await supabase
      .from('custom_games')
      .select('nano_id') 
      .eq('nano_id', id)
      .single(); 
  
    if (error) {
      console.error(error);
      return false;
    }
  
    return data ? true : false;
}
