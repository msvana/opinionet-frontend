export type WordCloudData = {
    text: string;
    value: number;
};

export async function fetchWordCloudData(
    sentiment: string,
    topic: number | null = null
): Promise<WordCloudData[]> {
    let url = `http://localhost:8000/wordcloud/${sentiment}`;
    if (topic !== null) {
        url += `?topic=${topic}`;
    }
    const request = await fetch(url);
    const response = await request.json();
    return response.words;
}
