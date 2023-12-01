'use client';
import { ICanvasEdge, ICanvasNode, GraphModel } from "react-dag-editor";
import { v4 as uuidv4 } from "uuid";

export const addGraphData = (graph: GraphModel, baseNode: ICanvasNode, subtopics: string[]): GraphModel => {
    let newData: GraphModel = graph;
    const baseWidth = baseNode.width ?? 110;
    const xOffset = baseNode.x + baseWidth/2 - (110*subtopics.length)/2;
    subtopics.forEach((topic, index) => {
        const nodeId = uuidv4();
        const node: ICanvasNode = {
            id: nodeId,
            name: topic,
            ports: [
                {
                    id: `port-top-${nodeId}`,
                    position: [0.5, 0],
                    name: "port",
                    isInputDisabled: false,
                    isOutputDisabled: true,
                    data: {
                        nodeType: "source",
                        },
                },
                {
                    id: `port-bottom-${nodeId}`,
                    position: [0.5, 1],
                    name: "port2",
                    isInputDisabled: false,
                    isOutputDisabled: false,
                    data: {
                        nodeType: "source",
                        },
                },
            ],
            data: {
                nodeType: "source",
            },
            x: xOffset + index * 110,
            y: baseNode.y + 100,
        };
        newData = newData.insertNode(node);
        const edge: ICanvasEdge = {
            id: `edge-${nodeId}`,
            source: baseNode.id,
            target: node.id,
            sourcePortId: `port-bottom-${baseNode.id}`,
            targetPortId: `port-top-${node.id}`,
        }
        newData = newData.insertEdge(edge);
    });
    return newData;
}