'use client';
import { ICanvasEdge, ICanvasNode, ICanvasData } from "react-dag-editor";
import { v4 as uuidv4 } from "uuid";
interface baseData {
    nodes: any[];
    edges: any[];
}

export const createBaseGraph = (topic: string, subtopics: string[]): ICanvasData => {
    let baseData: baseData = {
        nodes: [
          {
            id: "source",
            name: topic,
            ports: [
              {
                id: "port-bottom-source",
                position: [0.5, 1],
                name: "source port",
                isInputDisabled: false,
                isOutputDisabled: false,
                data: undefined,
              },
            ],
            data: {
              nodeType: "source",
            },
            x: window.innerWidth / 2 - 50,
            y: 100,
          },
        ],
        edges: [],
      };
    const baseNode = baseData.nodes[0];
    const baseWidth = 110;
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
        baseData.nodes.push(node);
        const edge: ICanvasEdge = {
            id: `edge-${nodeId}`,
            source: baseNode.id,
            target: node.id,
            sourcePortId: `port-bottom-${baseNode.id}`,
            targetPortId: `port-top-${node.id}`,
        }
        baseData.edges.push(edge);
    });
    return baseData;
}