import { ICanvasData } from "react-dag-editor";

export const graphSample: ICanvasData = {
    nodes: [
        {
            id: "source-1",
            name: "source",
            ports: [
                {
                id: "source-port",
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
        {
            id: "source-2",
            name: "source2",
            ports: [
                {
                id: "source-port2",
                position: [0.5, 0],
                name: "source port2",
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
            y: 200,
        },
    ],
    edges: [

    ]
};