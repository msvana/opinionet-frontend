import {BACKEND_URL} from "../Config";

export type WordCloudData = {
    text: string;
    value: number;
};

export async function fetchWordCloudData(
    city: string,
    sentiment: string,
    topic: number | null = null
): Promise<WordCloudData[]> {
    let url = `${BACKEND_URL}/wordcloud/${city}/${sentiment}`;
    if (topic !== null) {
        url += `?topic=${topic}`;
    }
    const request = await fetch(url);
    const response = await request.json();
    return response.words;
}
