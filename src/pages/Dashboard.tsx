import Plot from "react-plotly.js";
import { useEffect, useState } from "react";

type SentimentOverview = {
    name: string[];
    sentMean: number[];
    conPos: number[];
    conNeg: number[];
    mass: number[];
};

function Dashboard() {
    const [sentimentOverview, setSentimentOverview] = useState<SentimentOverview | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        const request = await fetch("http://localhost:8000/sentiment-overview");
        const response = await request.json();
        setSentimentOverview(response);
        setLoading(false);
    };

    useEffect(() => {
        if (sentimentOverview || loading) {
            return;
        }

        setLoading(true);
        fetchData().catch(console.log);
    }, [sentimentOverview, loading]);

    return (
        <>
            <div className="row">
                <div className="col p-3 bg-light border">
                    <h1>Topic sentiment</h1>
                    <p>
                        The graph shows average sentiment, level of positive sentiment, level of
                        negative sentiment and discussion volume. The greater the yellow square, the
                        more posts were published on the topic.
                    </p>
                    <div className="text-center">
                        <Plot
                            className="sentiment-overview"
                            data={[
                                {
                                    x: sentimentOverview?.name,
                                    y: sentimentOverview?.conNeg,
                                    type: "bar",
                                    marker: { color: "#dc3545" },
                                    name: "Negative sentiment",
                                },
                                {
                                    x: sentimentOverview?.name,
                                    y: sentimentOverview?.conPos,
                                    type: "bar",
                                    marker: { color: "#28a745" },
                                    name: "Positive sentiment",
                                },
                                {
                                    x: sentimentOverview?.name,
                                    y: sentimentOverview?.sentMean,
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
                                    y: sentimentOverview?.sentMean,
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
                            }}
                            config={{ responsive: true }}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col p-3 bg-light border">
                    <h1>Word cloud</h1>
                    <p>Most common words used in posts published from Ostrava</p>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
