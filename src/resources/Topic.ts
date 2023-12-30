import { BACKEND_URL } from "../Config";

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
    private topicsResponses: Map<string, TopicsResponse | null> = new Map();

    public static getInstance(): TopicList {
        if (!TopicList.instance) {
            TopicList.instance = new TopicList();
        }

        return TopicList.instance;
    }

    public async getTopics(city: string): Promise<TopicsResponse | null> {
        if (!this.topicsResponses.has(city)) {
            const response = await fetch(`${BACKEND_URL}/topics/${city}`);
            const json = await response.json();
            this.topicsResponses.set(city, json);
        }

        return this.topicsResponses.get(city) || null;
    }
}
