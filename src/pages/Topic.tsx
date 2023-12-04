import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WordCloud from "react-d3-cloud";
import { WordCloudData, fetchWordCloudData } from "../resources/WordCloud";

function Topic() {
    const { topicId } = useParams<{ topicId: string }>()
    const topicIdNumber = topicId !== undefined ? parseInt(topicId) : null;

    const [wordsPositive, setWordsNegative] = useState<WordCloudData[]>([]);
    const [wordsNegative, setWordsPositive] = useState<WordCloudData[]>([]);

    const fetchData = async () => {
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
