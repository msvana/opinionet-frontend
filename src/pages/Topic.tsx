import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WordCloud from "react-d3-cloud";
import { WordCloudData, fetchWordCloudData } from "../resources/WordCloud";
import { Topic as TopicType } from "../resources/Topic";

async function fetchTopicData(topicId: number): Promise<TopicType> {
    const request = await fetch(`http://localhost:8000/topic/${topicId}`);
    const response = await request.json();
    return response;
}

function Topic() {
    const { topicId } = useParams<{ topicId: string }>();
    const topicIdNumber = topicId !== undefined ? parseInt(topicId) : null;

    const [topic, setTopic] = useState<TopicType | null>(null);
    const [wordsPositive, setWordsNegative] = useState<WordCloudData[]>([]);
    const [wordsNegative, setWordsPositive] = useState<WordCloudData[]>([]);

    const fetchData = async () => {
        if (topicIdNumber !== null) {
            const topicData = await fetchTopicData(topicIdNumber);
            setTopic(topicData);
        }

        const positiveWordcloudData = await fetchWordCloudData("positive", topicIdNumber);
        setWordsPositive(positiveWordcloudData);

        const negativeWordcloudData = await fetchWordCloudData("negative", topicIdNumber);
        setWordsNegative(negativeWordcloudData);
    };

    useEffect(() => {
        fetchData().catch(console.log);
    }, []);

    return (
        <>
            <div className="row mt-3">
                <div className="col">
                    <div className="bg-light border p-3">
                        <h1>{topic?.name || ""}</h1>
                        <p>{topic?.topWords || ""}</p>

                        <div className="row">
                            <div className="col-sm-6">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th className="text-end" style={{minWidth: '50%'}}>Mean sentiment</th>
                                            <td>
                                                {(100 * (topic?.meanSentiment || 0)).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-end">Level of positivity</th>
                                            <td>
                                                {(100 * (topic?.levelPositivity || 0)).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-end">Level of negativity</th>
                                            <td>
                                                {(100 * (topic?.levelNegativity || 0)).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-end">Controversy</th>
                                            <td>
                                                {(100 * (topic?.controversy || 0)).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-end">Volume of discussion</th>
                                            <td>
                                                {(topic?.mass || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
