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
