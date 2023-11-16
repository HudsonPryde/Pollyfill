import * as React from 'react';
import {
  getRectHeight,
  getRectWidth,
  Graph,
  GraphModel,
  GraphConfigBuilder,
  GraphNodeStatus,
  GraphPortStatus,
  Bitset,
  ICanvasNode,
  ICanvasPort,
  IGetConnectableParams,
  INodeConfig,
  IPortConfig,
  IPortDrawArgs,
  ReactDagEditor,
  useGraphReducer,
  RenderNodeAnchors,
} from 'react-dag-editor'; // Graph component & utils
import { graphSample } from '../data/graphSample';

const sourceNodeConfig: INodeConfig = {
  // min height constraint for node resizing.
  getMinHeight: () => 60,
  // min width constraint for node resizing.
  getMinWidth: () => 100,
  // render decides the element to represent a node
  render(args): React.ReactNode {
    const height = getRectHeight(sourceNodeConfig, args.model);
    const width = getRectWidth(sourceNodeConfig, args.model);

    const fill = Bitset.has(GraphNodeStatus.Activated)(args.model.status)
      ? "red"
      : "blue";
    const stroke = Bitset.has(GraphNodeStatus.Selected)(args.model.status)
      ? "green"
      : "none";

    return (
      <ellipse
        rx={width / 2}
        ry={height / 2}
        cx={args.model.x + width / 2}
        cy={args.model.y + height / 2}
        stroke={stroke}
        strokeWidth={4}
        fill={fill}
        fillOpacity={0.8}
      />
    );
  },
};

interface IPortProps {
  data: GraphModel;
  port: ICanvasPort;
  parentNode: ICanvasNode;
  x: number;
  y: number;
  style: React.CSSProperties;
  isConnectable: boolean | undefined;
}

const RADIUS = 18;

export const Port: React.FunctionComponent<IPortProps> = (props) => {
  const { port, x, y, parentNode, style, isConnectable } = props;

  const renderCircle = (
    r: number,
    circleStyle: Partial<React.CSSProperties>
  ): React.ReactNode => {
    return <circle r={r} cx={x} cy={y} style={circleStyle} />;
  };

  const opacity = Bitset.has(GraphNodeStatus.UnconnectedToSelected)(
    parentNode.status
  )
    ? "60%"
    : "100%";

  return (
    <g opacity={opacity}>
      {isConnectable === undefined ? ( // isConnectable === undefined is when the graph is not in connecting state
        <>
          {Bitset.has(GraphPortStatus.Activated)(port.status)
            ? renderCircle(7, style)
            : renderCircle(5, style)}
        </>
      ) : Bitset.has(GraphPortStatus.ConnectingAsTarget)(port.status) ? (
        renderCircle(7, style)
      ) : (
        <>
          {isConnectable &&
            renderCircle(RADIUS, { fill: "#0078ba", opacity: 0.2 })}
          {renderCircle(5, style)}
        </>
      )}
      <circle r={RADIUS} fill="transparent" cx={x} cy={y} />
    </g>
  );
};

class MyPortConfig implements IPortConfig {
  public getStyle(
    port: ICanvasPort,
    _parentNode: ICanvasNode,
    _data: GraphModel,
    isConnectable: boolean | undefined,
    connectedAsSource: boolean,
    connectedAsTarget: boolean
  ): Partial<React.CSSProperties> {
    const strokeWidth = 1;
    let stroke = "#B3B0AD";
    let strokeDasharray = "";
    let fill = "#ffffff";

    if (connectedAsSource || connectedAsTarget) {
      fill = "#B3B0AD";
    }

    if (
      Bitset.has(
        GraphPortStatus.Activated |
          GraphPortStatus.Selected |
          GraphPortStatus.Connecting
      )(port.status)
    ) {
      fill = "#0078D4";
      stroke = "#0078D4";
    }

    if (Bitset.has(GraphPortStatus.Connecting)(port.status)) {
      switch (isConnectable) {
        case true:
          fill = "#ffffff";
          stroke = "#0078D4";
          strokeDasharray = "3,2";
          break;
        case false:
          fill = "#E1DFDD";
          if (Bitset.has(GraphPortStatus.Activated)(port.status)) {
            stroke = "#B3B0AD";
          }
          break;
        default:
      }
    }

    return {
      stroke,
      strokeWidth,
      strokeDasharray,
      fill,
    };
  }

  public getIsConnectable({
    anotherPort,
    model,
  }: IGetConnectableParams): boolean | undefined {
    if (!anotherPort) {
      return undefined;
    }
    return (
      (!anotherPort.isOutputDisabled && !model.isInputDisabled) ||
      (!anotherPort.isInputDisabled && !model.isOutputDisabled)
    );
  }

  public render(args: IPortDrawArgs): React.ReactNode {
    const { model: port, data, x, y, parentNode } = args;
    const isConnectable = this.getIsConnectable(args);
    const connectedAsSource = data.isPortConnectedAsSource(
      parentNode.id,
      port.id
    );
    const connectedAsTarget = data.isPortConnectedAsTarget(
      parentNode.id,
      port.id
    );

    return (
      <Port
        data={data}
        port={port}
        parentNode={parentNode}
        x={x}
        y={y}
        style={this.getStyle(
          port,
          parentNode,
          data,
          isConnectable,
          connectedAsSource,
          connectedAsTarget
        )}
        isConnectable={isConnectable}
      />
    );
  }

  // hover view for ports
  public renderTooltips(args: Omit<IPortDrawArgs, "setData">): React.ReactNode {
    const styles: React.CSSProperties = {
      position: "absolute",
      left: args.x + 8,
      top: args.y + 8,
      background: "#fff",
      height: 30,
      border: "1px solid #ccc",
      minWidth: 50,
      zIndex: 1000,
    };

    return (
      <div style={styles}>
        {args.parentNode.name} {args.model.name}
      </div>
    );
  }
}

export const graphConfig = GraphConfigBuilder.default()
  .registerNode((node) => {
    const nodeType =
      (node.data as { nodeType: string } | undefined)?.nodeType ?? "";
    switch (nodeType) {
      case "source":
        return sourceNodeConfig;
      default:
        return undefined;
    }
  })
  .registerPort((port) => {
    const nodeType =
      (port.data as { nodeType: string } | undefined)?.nodeType ?? "";
    switch (nodeType) {
      case "source":
        return new MyPortConfig();
      default:
        return undefined;
    }
  })
  .build();

const FeaturesDemo: React.FC = () => {
  const [state, dispatch] = useGraphReducer(
    {
      settings: {
        graphConfig,
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

  return (
    <ReactDagEditor
      style={{ width: "900px", height: "600px" }}
      state={state}
      dispatch={dispatch}
    >
      <Graph renderNodeAnchors={renderNodeAnchors} />
    </ReactDagEditor>
  );
};

export default FeaturesDemo;