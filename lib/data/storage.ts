'use client'
import { v4 as uuidv4 } from 'uuid';

export function createTopic(topic: string) {
    const id = uuidv4();
    localStorage.setItem(id, `{"topic": "${topic}", "graphData": {}, "history": []}`);
    return id;
}

export function getTopic(id: string) {
    return JSON.parse(localStorage.getItem(id) || "{}");
}

export function setTopicGraphData(id: string, graphData: string) {
    let newData = JSON.parse(localStorage.getItem(id) ?? "{}");
    newData.graphData = graphData;
    localStorage.setItem(id, JSON.stringify(newData));
}

export function setTopicHistory(id: string, history: string) {
    let newData = JSON.parse(localStorage.getItem(id) ?? "[]")
    newData.history.push(JSON.parse(history));
    localStorage.setItem(id, JSON.stringify(newData));
}

export function getTopicHistory(id: string) {
    return JSON.parse(localStorage.getItem(id) ?? "{}").history;
}

// return the id and first node label of all topics
export function listTopics() {
    const topics = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const data = JSON.parse(localStorage.getItem(key) || "{}");
            topics.push({id: key, label: data.topic});
        }
    }
    return topics;
}