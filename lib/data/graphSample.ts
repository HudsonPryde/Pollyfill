import { ICanvasData } from "react-dag-editor";

export const graphSample: ICanvasData = {
    nodes: [
        {
            id: "source",
            name: "source",
            ports: [
                {
                id: "port-bottom-source",
                position: [0.5, 1],
                name: "source port",
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
            x: 100,
            y: 100,
        },
    ],
    edges: [],
};