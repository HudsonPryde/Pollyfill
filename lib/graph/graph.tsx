import * as React from 'react';
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
  updateData,
  ICanvasUpdateDataEvent,
  setData,
} from 'react-dag-editor'; // Graph component & utils
import { graphSample } from '../data/graphSample';
import { subtopics } from '../data/sampleResponse'; 
import { EdgeConfig } from './edge'
import { PortConfig } from './port'
import { NodeConfig } from './node'
import { addGraphData } from '../util/createGraphData';



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



const FeaturesDemo: React.FC = () => {
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
      data: GraphModel.fromJSON(graphSample),
    },
    undefined
  );

  /** Render your custom anchors of node by shape */
  const renderNodeAnchors: RenderNodeAnchors = React.useCallback(
    (node, getMouseDown, defaultAnchors) => {
      return defaultAnchors
    },
    []
  );

  // add subtopics to graph
  React.useEffect(() => {
    // const newGraph = addGraphData(graph, nodes[0], subtopics);
    // console.log(newGraph);
    // dispatch({ type: GraphCanvasEvent.SetData, data: newGraph})
    dispatch({ type: GraphCanvasEvent.UpdateData, shouldRecord: false, updater(prevData) {
      const nodes = prevData.toJSON().nodes;
      return addGraphData(prevData, nodes[0], subtopics);
    }, })
    dispatch({ type: GraphCanvasEvent.UpdateData, shouldRecord: false, updater(prevData) {
      const nodes = prevData.toJSON().nodes;
      return addGraphData(prevData, nodes[4], subtopics);
    }, })
    dispatch({ type: GraphCanvasEvent.UpdateData, shouldRecord: false, updater(prevData) {
      const nodes = prevData.toJSON().nodes;
      return addGraphData(prevData, nodes[6], subtopics);
    }, })
  }, []);
  
  // pan on middle mouse button down
  React.useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        // mouse move listner
        const onMouseMove = (e: MouseEvent) => {
          document.body.style.cursor = "grabbing";
          dispatch({ type: GraphCanvasEvent.Drag, dx: e.movementX*0.5, dy: e.movementY*0.5, rawEvent: e });
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
      style={{ flex: 1, display: "flex", flexDirection: "column", height: '100vh' }}
      state={state}
      dispatch={dispatch}
      
    >
      <Graph renderNodeAnchors={renderNodeAnchors} canvasMouseMode={CanvasMouseMode.Select}/>
    </ReactDagEditor>
  );
};

export default FeaturesDemo;