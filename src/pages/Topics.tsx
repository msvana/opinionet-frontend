import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

type Topic = {
    name: string;
    sentMean: number;
    conPos: number;
    conNeg: number;
    mass: number;
};

async function fetctTopicsData(): Promise<Topic[]> {
    const request = await fetch(`http://localhost:8000/topics`);
    const response = await request.json();
    return response.topics;
}

function Topics() {
    const [loading, setLoading] = useState<boolean>(false);
    const [topics, setTopics] = useState<Topic[]>([]);

    async function fetchTopicsData() {
        const topicsData = await fetctTopicsData();
        setTopics(topicsData);
        setLoading(false);
    }

    useEffect(() => {
        if (loading || topics.length > 0) {
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
                    <p>The table lists all topics detected in tweets from Ostrava. Click the topic name to explore it in more detail.</p>
                    <DataTable
                        columns={[
                            {
                                name: <b>Topic</b>,
                                format: (row) => <Link to="/">{row.name}</Link>,
                                selector: (row) => row.name,
                                grow: 2,
                            },
                            {
                                name: <b>Mean Sentiment</b>,
                                selector: (row) => row.sentMean,
                                sortable: true,
                                format: (row) => row.sentMean.toFixed(3),
                            },
                            {
                                name: <b>Positive Sentiment Level</b>,
                                selector: (row) => row.conPos,
                                sortable: true,
                                format: (row) => row.conPos.toFixed(3),
                            },
                            {
                                name: <b>Negative Sentiment Level</b>,
                                selector: (row) => row.conNeg,
                                sortable: true,
                                format: (row) => row.conNeg.toFixed(3),
                            },
                            {
                                name: <b>Discussion Volume</b>,
                                selector: (row) => row.mass,
                                sortable: true,
                                format: (row) => row.mass.toFixed(3),
                            },
                        ]}
                        data={topics}
                        striped={true}
                        customStyles={{
                            head: { style: { fontSize: "1rem" } },
                            rows: { style: { fontSize: "1rem" } },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Topics;
