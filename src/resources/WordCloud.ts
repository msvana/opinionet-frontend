export type WordCloudData = {
    text: string;
    value: number;
};

export async function fetchWordCloudData(
    city: string,
    sentiment: string,
    topic: number | null = null
): Promise<WordCloudData[]> {
    let url = `http://localhost:8000/wordcloud/${city}/${sentiment}`;
    if (topic !== null) {
        url += `?topic=${topic}`;
    }
    const request = await fetch(url);
    const response = await request.json();
    return response.words;
}
