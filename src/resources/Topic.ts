export type Topic = {
    id: number | null;
    name: string;
    topWords: string;
    meanSentiment: number;
    levelPositivity: number;
    levelNegativity: number;
    mass: number;
    controversy: number;
};

export type TopicsResponse = {
    topics: Topic[];
    max: Topic;
    topQuantile: Topic;
    bottomQuantile: Topic;
};

export class TopicList {
    private static instance: TopicList;
    private topicsResponse: TopicsResponse | null = null;

    public static getInstance(): TopicList {
        if (!TopicList.instance) {
            TopicList.instance = new TopicList();
        }

        return TopicList.instance;
    }

    public async getTopics(): Promise<TopicsResponse | null> {
        if (this.topicsResponse === null) {
            const response = await fetch("http://localhost:8000/topics");
            const json = await response.json();
            this.topicsResponse = json;
        }

        return this.topicsResponse;
    }
}
