import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fhvyejghylntcyvatwuq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodnllamdoeWxudGN5dmF0d3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNzQ0NjcsImV4cCI6MjA1NjY1MDQ2N30.WE8jhlvG-MSwcBq-GwaM5YYNJt3qZv2Ob8bvMXRru2M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getAllImages(table) {
    const {data, error} = await supabase.from(table).select("*")

    if (error) {
        console.log("error: ", error)
        return []
    }

    return data
}

export async function getAllScores(table) {
    const {data, error} = await supabase.from(table).select("*")

    if (error) {
        console.log("error: ", error)
        return []
    }

    return data
}

export async function writeScore(table, data) {
    const { error } = await supabase
            .from(table)
            .insert([{ name: data.name, score: data.score }]);

        if (error) {
            message = 'Failed to submit score!';
            console.error(error);
        }
}