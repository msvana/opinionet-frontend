import Plot from "react-plotly.js";

function Dashboard() {
    const topics = ["Healhcare", "Education", "Environment", "Transport", "Housing"];

    return (
        <>
            <div className="row">
                <div className="col p-3 bg-light border">
                    <h1>Topic sentiment</h1>
                    <p>
                        The graph shows average sentiment, level of positive sentiment, level of
                        negative sentiment and discussion volume.
                    </p>
                    <div className="text-center">
                        <Plot
                            data={[
                                {
                                    x: topics,
                                    y: [-0.2, -0.3, -0.5, -0.15, -0.4],
                                    width: [0.85, 0.5, 0.5, 0.8, 0.5],
                                    type: "bar",
                                    marker: { color: "#dc3545" },
                                    name: "Negative sentiment",
                                },
                                {
                                    x: topics,
                                    y: [0.8, 0.7, 0.5, 0.85, 0.6],
                                    width: [0.85, 0.5, 0.5, 0.8, 0.5],
                                    type: "bar",
                                    marker: { color: "#28a745" },
                                    name: "Positive sentiment",
                                },
                                {
                                    x: topics,
                                    y: [0.2, 0.15, 0.3, 0.25, -0.05],
                                    marker: { color: "#ffc107", size: 12, symbol: "square" },
                                    name: "Average sentiment",
                                    type: "scatter",
                                    mode: "markers"
                                },
                            ]}
                            layout={{
                                autosize: true,
                                paper_bgcolor: "#f8f9fa",
                                plot_bgcolor: "#f8f9fa",
                                barmode: "relative",
                                margin: { t: 0, r: 0, l: 40, b: 18 },
                            }}
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
