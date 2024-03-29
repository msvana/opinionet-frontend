import { useContext, useEffect, useState } from "react";
import WordCloud from "react-d3-cloud";
import Plot from "react-plotly.js";
import CityContext from "../resources/CityContext";
import { WordCloudData, fetchWordCloudData } from "../resources/WordCloud";
import { BACKEND_URL } from "../Config";

type SentimentOverview = {
    name: string[];
    meanSentiment: number[];
    levelPositivity: number[];
    levelNegativity: number[];
    mass: number[];
};

async function fetchSentimentOverview(city: string): Promise<SentimentOverview> {
    const request = await fetch(`${BACKEND_URL}/sentiment-overview/${city}`);
    const response = await request.json();
    return response;
}

function Dashboard() {
    const [sentimentOverview, setSentimentOverview] = useState<SentimentOverview | null>(null);
    const [wordsPositive, setWordsPositive] = useState<WordCloudData[]>([]);
    const [wordsNegative, setWordsNegative] = useState<WordCloudData[]>([]);
    const city = useContext(CityContext);

    const fetchData = async () => {
        const sentimentOverviewData = await fetchSentimentOverview(city);
        setSentimentOverview(sentimentOverviewData);

        const positiveWordcloudData = await fetchWordCloudData(city, "positive");
        setWordsPositive(positiveWordcloudData);

        const negativeWordcloudData = await fetchWordCloudData(city, "negative");
        setWordsNegative(negativeWordcloudData);
    };

    useEffect(() => {
        fetchData().catch(console.log);
    }, [city]);

    return (
        <>
            <div className="row">
                <div className="col pt-3">
                    <div className="bg-light border p-3">
                        <h1>Topic sentiment</h1>
                        <p>
                            The graph shows average sentiment, level of positive sentiment, level of
                            negative sentiment and discussion volume. The greater the yellow square,
                            the more posts were published on the topic.
                        </p>
                        <div className="text-center">
                            <Plot
                                className="stretchy-plot"
                                data={[
                                    {
                                        x: sentimentOverview?.name,
                                        y: sentimentOverview?.levelNegativity,
                                        type: "bar",
                                        marker: { color: "#dc3545" },
                                        name: "Negative sentiment",
                                    },
                                    {
                                        x: sentimentOverview?.name,
                                        y: sentimentOverview?.levelPositivity,
                                        type: "bar",
                                        marker: { color: "#28a745" },
                                        name: "Positive sentiment",
                                    },
                                    {
                                        x: sentimentOverview?.name,
                                        y: sentimentOverview?.meanSentiment,
                                        marker: {
                                            color: "#ffc107",
                                            size: sentimentOverview?.mass,
                                            symbol: "square",
                                        },
                                        name: "Average sentiment",
                                        type: "scatter",
                                        mode: "markers",
                                    },
                                    {
                                        x: sentimentOverview?.name,
                                        y: sentimentOverview?.meanSentiment,
                                        marker: { color: "#ffffff", size: 2, symbol: "square" },
                                        type: "scatter",
                                        showlegend: false,
                                        mode: "markers",
                                    },
                                ]}
                                layout={{
                                    autosize: true,
                                    paper_bgcolor: "#f8f9fa",
                                    plot_bgcolor: "#f8f9fa",
                                    barmode: "relative",
                                    margin: { t: 0, r: 0, l: 39, b: 200 },
                                    xaxis: { tickangle: 45 },
                                    showlegend: false,
                                }}
                                config={{ responsive: true, displayModeBar: false }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-6 pt-3">
                    <div className="bg-light border p-3">
                        <h1>Word cloud for Positive tweets</h1>
                        <p>Most common words used in positive posts published from Ostrava</p>
                        <WordCloud
                            data={wordsPositive}
                            fontSize={(word) => word.value / 2}
                            rotate={0}
                            fill="green"
                        />
                    </div>
                </div>
                <div className="col-lg-6 pt-3">
                    <div className="bg-light border p-3">
                        <h1>Word cloud for Negative tweets</h1>
                        <p>Most common words used in negative posts published from Ostrava</p>
                        <WordCloud
                            data={wordsNegative}
                            fontSize={(word) => word.value / 2}
                            rotate={0}
                            fill="red"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
