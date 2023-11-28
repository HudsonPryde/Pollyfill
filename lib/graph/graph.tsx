import * as React from "react";
import {
  Graph,
  GraphModel,
  GraphConfigBuilder,
  ReactDagEditor,
  useGraphReducer,
  RenderNodeAnchors,
  GraphFeatures,
  CanvasMouseMode,
  GraphCanvasEvent,
  ICanvasData,
} from "react-dag-editor"; // Graph component & utils
import { graphSample } from "../data/graphSample";
import { EdgeConfig } from "./edge";
import { PortConfig } from "./port";
import { NodeConfig } from "./node";

export const graphConfig = GraphConfigBuilder.default()
  .registerNode((node) => {
    const nodeType =
      (node.data as { nodeType: string } | undefined)?.nodeType ?? "";
    switch (nodeType) {
      case "source":
        return NodeConfig;
      default:
        return undefined;
    }
  })
  .registerPort((port) => {
    const nodeType =
      (port.data as { nodeType: string } | undefined)?.nodeType ?? "";
    switch (nodeType) {
      case "source":
        return new PortConfig();
      default:
        return undefined;
    }
  })
  .registerEdge((_edge) => EdgeConfig)
  .build();

interface GraphViewProps {
  topic: string;
}
const GraphView = ({ topic }: GraphViewProps) => {
  const baseNode: ICanvasData = {
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
            data: {
              nodeType: "source",
            },
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
  const [state, dispatch] = useGraphReducer(
    {
      settings: {
        graphConfig,
        features: new Set([
          GraphFeatures.NodeDraggable,
          GraphFeatures.NodeResizable,
          GraphFeatures.ClickNodeToSelect,
          GraphFeatures.PanCanvas,
          GraphFeatures.CanvasHorizontalScrollable,
          GraphFeatures.CanvasVerticalScrollable,
          GraphFeatures.NodeHoverView,
          GraphFeatures.PortHoverView,
          GraphFeatures.A11yFeatures,
          GraphFeatures.CtrlKeyZoom,
          GraphFeatures.LimitBoundary,
        ]),
      },
      data: GraphModel.fromJSON(baseNode),
    },
    undefined
  );

  /** Render your custom anchors of node by shape */
  const renderNodeAnchors: RenderNodeAnchors = React.useCallback(
    (node, getMouseDown, defaultAnchors) => {
      return defaultAnchors;
    },
    []
  );

  // pan on middle mouse button down
  React.useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        // mouse move listner
        const onMouseMove = (e: MouseEvent) => {
          document.body.style.cursor = "grabbing";
          dispatch({
            type: GraphCanvasEvent.Drag,
            dx: e.movementX * 0.5,
            dy: e.movementY * 0.5,
            rawEvent: e,
          });
        };
        // mouse up listner
        const onMouseUp = (e: MouseEvent) => {
          window.removeEventListener("mousemove", onMouseMove, true);
          document.body.style.cursor = "inherit";
        };
        window.addEventListener("mousemove", onMouseMove, true);
        window.addEventListener("mouseup", onMouseUp, false);
      }
    };
    window.addEventListener("mousedown", onMouseDown, true);
  }, [dispatch]);

  return (
    <ReactDagEditor
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
      state={state}
      dispatch={dispatch}
    >
      <Graph
        renderNodeAnchors={renderNodeAnchors}
        canvasMouseMode={CanvasMouseMode.Select}
      />
    </ReactDagEditor>
  );
};

export default GraphView;
