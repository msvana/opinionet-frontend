import { useContext, useEffect, useMemo, useState } from "react";
import DataTable, { TableRow } from "react-data-table-component";
import { Link } from "react-router-dom";
import CityContext from "../resources/CityContext";
import type { TopicsResponse } from "../resources/Topic";
import { TopicList, Topic } from "../resources/Topic";

function formatTopicData(
    statistic: "meanSentiment" | "levelPositivity" | "levelNegativity" | "mass" | "controversy",
    preferredDirection: "max" | "min",
    topics: TopicsResponse | null,
    multiply: boolean = false
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
                {(multiply ? statisticValue * 100 : statisticValue).toFixed(3)}
            </>
        );
    };
}

function Topics() {
    const [topicsResponse, setTopicsResponse] = useState<TopicsResponse | null>(null);
    const city = useContext(CityContext);

    const columns = useMemo(
        () => [
            {
                name: <b>Topic</b>,
                format: (row: Topic) => <Link to={"/topic/" + row.id}>{row.name}</Link>,
                selector: (row: Topic) => row.name,
                grow: 2,
            },
            {
                name: <b>Mean Sentiment</b>,
                selector: (row: Topic) => row.meanSentiment,
                sortable: true,
                format: formatTopicData("meanSentiment", "max", topicsResponse, true),
            },
            {
                name: <b>Positive Sentiment Level</b>,
                selector: (row: Topic) => row.levelPositivity,
                sortable: true,
                format: formatTopicData("levelPositivity", "max", topicsResponse, true),
            },
            {
                name: <b>Negative Sentiment Level</b>,
                selector: (row: Topic) => row.levelNegativity,
                sortable: true,
                format: formatTopicData("levelNegativity", "min", topicsResponse, true),
            },
            {
                name: <b>Controversy</b>,
                selector: (row: Topic) => row.controversy,
                sortable: true,
                format: formatTopicData("controversy", "min", topicsResponse, true),
            },
            {
                name: <b>Discussion Volume</b>,
                selector: (row: Topic) => row.mass,
                sortable: true,
                format: formatTopicData("mass", "max", topicsResponse),
            },
        ],
        [topicsResponse]
    );

    async function loadTopics() {
        setTopicsResponse(await TopicList.getInstance().getTopics(city));
    }

    useEffect(() => {
        loadTopics().catch(console.error);
    }, [city]);

    return (
        <div className="row">
            <div className="col">
                <div className="bg-light border p-3">
                    <h1>Topics</h1>
                    <p>
                        The table lists all topics detected in tweets from {city[0].toUpperCase() + city.slice(1)}. Click the topic
                        name to explore it in more detail.
                    </p>
                    <DataTable
                        columns={columns}
                        data={topicsResponse?.topics || []}
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
