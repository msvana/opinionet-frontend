import {useContext, useEffect, useState} from "react";
import WordCloud from "react-d3-cloud";
import Plot from "react-plotly.js";
import {useParams} from "react-router-dom";
import CityContext from "../resources/CityContext";
import {TopicList, Topic as TopicType, TopicsResponse} from "../resources/Topic";
import {WordCloudData, fetchWordCloudData} from "../resources/WordCloud";

type RadarData = {
    values: number[];
    topicName: string;
};

async function fetchTopicData(city: string, topicId: number): Promise<TopicType> {
    const request = await fetch(`http://localhost:8000/topics/${city}/${topicId}`);
    const response = await request.json();
    return response;
}

function getTopicRadarData(topic: TopicType | null, maxValues: TopicType | null): RadarData {
    if (!topic || !maxValues) {
        return {
            values: [0, 0, 0, 0, 0, 0],
            topicName: "",
        };
    }

    return {
        values: [
            (topic.meanSentiment || 1) / (maxValues.meanSentiment || 1) || 0,
            (topic.levelPositivity || 1) / (maxValues.levelPositivity || 1) || 0,
            (topic.levelNegativity || 1) / (maxValues.levelNegativity || 1) || 0,
            (topic.controversy || 1) / (maxValues.controversy || 1) || 0,
            (topic.mass || 1) / (maxValues.mass || 1) || 0,
            (topic.meanSentiment || 1) / (maxValues.meanSentiment || 1) || 0,
        ],
        topicName: topic.name || "",
    };
}

function Topic() {
    const { topicId } = useParams<{ topicId: string }>();
    const topicIdNumber = topicId !== undefined ? parseInt(topicId) : null;

    const [allTopics, setAllTopics] = useState<TopicsResponse | null>(null);
    const [topic, setTopic] = useState<TopicType | null>(null);
    const [radarData, setRadarData] = useState<RadarData[]>([]);

    const [wordsPositive, setWordsNegative] = useState<WordCloudData[]>([]);
    const [wordsNegative, setWordsPositive] = useState<WordCloudData[]>([]);
    const city = useContext(CityContext);

    const fetchData = async () => {
        if (topicIdNumber === null) {
            return;
        }

        const topicData = await fetchTopicData(city, topicIdNumber);
        const allTopicsData = await TopicList.getInstance().getTopics(city);

        setTopic(topicData);
        setAllTopics(allTopicsData);
        setRadarData([getTopicRadarData(topicData, allTopicsData?.max || null)]);

        const positiveWordcloudData = await fetchWordCloudData(city, "positive", topicIdNumber);
        setWordsPositive(positiveWordcloudData);

        const negativeWordcloudData = await fetchWordCloudData(city, "negative", topicIdNumber);
        setWordsNegative(negativeWordcloudData);
    };

    function changeOtherTopic(event: React.ChangeEvent<HTMLSelectElement>) {
        const otherTopicId = parseInt(event.target.value);
        if (otherTopicId === -1) {
            setRadarData([getTopicRadarData(topic, allTopics?.max || null)]);
        } else {
            const otherTopic = allTopics?.topics.find((t) => t.id === otherTopicId) || null;
            setRadarData([
                getTopicRadarData(topic, allTopics?.max || null),
                getTopicRadarData(otherTopic, allTopics?.max || null),
            ]);
        }
    }

    useEffect(() => {
        fetchData().catch(console.log);
    }, [city]);

    return (
        <>
            <div className="row mt-3">
                <div className="col-lg-6">
                    <div className="bg-light border p-3" style={{ height: "100%" }}>
                        <h1>{topic?.name || ""}</h1>
                        <p>{topic?.topWords || ""}</p>

                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th className="text-end">Mean sentiment</th>
                                    <td>{(100 * (topic?.meanSentiment || 0)).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th className="text-end">Level of positivity</th>
                                    <td>{(100 * (topic?.levelPositivity || 0)).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th className="text-end">Level of negativity</th>
                                    <td>{(100 * (topic?.levelNegativity || 0)).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th className="text-end">Controversy</th>
                                    <td>{(100 * (topic?.controversy || 0)).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th className="text-end">Volume of discussion</th>
                                    <td>{(topic?.mass || 0).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="bg-light border p-3">
                        <h1>Compare with another topic</h1>

                        <select onChange={changeOtherTopic}>
                            <option value={-1}>Select topic ...</option>
                            {allTopics?.topics
                                .filter((t) => t.id != topic?.id)
                                .map((topic) => (
                                    <option key={topic.id} value={topic.id || 0}>
                                        {topic.name}
                                    </option>
                                ))}
                        </select>

                        <Plot
                            data={
                                radarData.map((data) => ({
                                    type: "scatterpolar",
                                    r: data.values,
                                    theta: [
                                        "Mean sentiment",
                                        "Level of positivity",
                                        "Level of negativity",
                                        "Controversy",
                                        "Volume of discussion",
                                        "Mean sentiment",
                                    ],
                                    fill: "toself",
                                    name: data.topicName,
                                })) || []
                            }
                            layout={{
                                paper_bgcolor: "#f8f9fa",
                                plot_bgcolor: "#f8f9fa",
                                polar: {
                                    radialaxis: {
                                        visible: true,
                                        range: [0, 1],
                                    },
                                },
                                showlegend: false,
                                autosize: true,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-lg-6">
                    <div className="bg-light border p-3">
                        <h1>Word cloud for Positive tweets</h1>
                        <p>Most common words used in positive posts on this topic</p>
                        <WordCloud
                            data={wordsPositive}
                            fontSize={(word) => word.value / 3}
                            rotate={0}
                            fill="green"
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="bg-light border p-3">
                        <h1>Word cloud for Negative tweets</h1>
                        <p>Most common words used in negative posts on this topic</p>
                        <WordCloud
                            data={wordsNegative}
                            fontSize={(word) => word.value / 3}
                            rotate={0}
                            fill="red"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Topic;
