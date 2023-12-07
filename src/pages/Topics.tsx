import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { TableRow } from "react-data-table-component";
import { Link } from "react-router-dom";

type Topic = {
    id: number | null;
    name: string;
    meanSentiment: number;
    levelPositivity: number;
    levelNegativity: number;
    mass: number;
};

type TopicsResponse = {
    topics: Topic[];
    max: Topic;
    topQuantile: Topic;
    bottomQuantile: Topic;
};

async function fetctTopicsData(): Promise<TopicsResponse> {
    const request = await fetch(`http://localhost:8000/topics`);
    const response = await request.json();
    return response;
}

function formatTopicData(
    statistic: "meanSentiment" | "levelPositivity" | "levelNegativity" | "mass",
    preferredDirection: "max" | "min",
    topics: TopicsResponse | null
) {
    return function (row: TableRow) {
        if (!topics) {
            return "";
        }

        const statisticValue = row[statistic] as number;
        let backgroundColor = "#007bff";

        if (preferredDirection === "max" && statisticValue >= topics.topQuantile[statistic]) {
            backgroundColor = "green";
        } else if (
            preferredDirection === "min" &&
            statisticValue >= topics.topQuantile[statistic]
        ) {
            backgroundColor = "red";
        } else if (
            preferredDirection === "max" &&
            statisticValue <= topics.bottomQuantile[statistic]
        ) {
            backgroundColor = "red";
        } else if (
            preferredDirection === "min" &&
            statisticValue <= topics.bottomQuantile[statistic]
        ) {
            backgroundColor = "green";
        }

        return (
            <>
                <div
                    className="datatable-bar"
                    style={{
                        width: `${(90 * statisticValue) / topics.max[statistic]}%`,
                        backgroundColor: backgroundColor,
                    }}
                ></div>
                {statisticValue.toFixed(3)}
            </>
        );
    };
}

function Topics() {
    const [loading, setLoading] = useState<boolean>(false);
    const [topics, setTopics] = useState<TopicsResponse | null>(null);

    async function fetchTopicsData() {
        const topicsData = await fetctTopicsData();
        setTopics(topicsData);
        setLoading(false);
    }

    useEffect(() => {
        if (loading || topics) {
            return;
        }

        setLoading(true);
        fetchTopicsData().catch(console.log);
    }, []);

    return (
        <div className="row">
            <div className="col">
                <div className="bg-light border p-3">
                    <h1>Topics</h1>
                    <p>
                        The table lists all topics detected in tweets from Ostrava. Click the topic
                        name to explore it in more detail.
                    </p>
                    <DataTable
                        columns={[
                            {
                                name: <b>Topic</b>,
                                format: (row) => <Link to={"/topic/" + row.id}>{row.name}</Link>,
                                selector: (row) => row.name,
                                grow: 2,
                            },
                            {
                                name: <b>Mean Sentiment</b>,
                                selector: (row) => row.meanSentiment,
                                sortable: true,
                                format: formatTopicData("meanSentiment", "max", topics),
                            },
                            {
                                name: <b>Positive Sentiment Level</b>,
                                selector: (row) => row.levelPositivity,
                                sortable: true,
                                format: formatTopicData("levelPositivity", "max", topics),
                            },
                            {
                                name: <b>Negative Sentiment Level</b>,
                                selector: (row) => row.levelNegativity,
                                sortable: true,
                                format: formatTopicData("levelNegativity", "min", topics),
                            },
                            {
                                name: <b>Discussion Volume</b>,
                                selector: (row) => row.mass,
                                sortable: true,
                                format: formatTopicData("mass", "max", topics),
                            },
                        ]}
                        data={topics?.topics || []}
                        customStyles={{
                            head: { style: { fontSize: "1rem" } },
                            rows: { style: { fontSize: "1rem", background: "none" } },
                            cells: { style: { zIndex: 1 } },
                            headRow: { style: { background: "none" } },
                            table: { style: { background: "none" } },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Topics;
