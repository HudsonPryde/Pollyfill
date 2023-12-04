import { useEffect, useMemo } from "react";
import {
  Bitset,
  GraphModel,
  GraphNodeStatus,
  GraphPortStatus,
  ICanvasNode,
  ICanvasPort,
  IGetConnectableParams,
  IPortConfig,
  IPortDrawArgs,
  useGraphState,
  GraphCanvasEvent,
  updateData,
} from "react-dag-editor";
import { addGraphData } from "../utils/addGraphData";
import axios from "axios";

export class PortConfig implements IPortConfig {
  public getStyle(
    port: ICanvasPort,
    _parentNode: ICanvasNode,
    _data: GraphModel,
    isConnectable: boolean | undefined,
    connectedAsSource: boolean,
    connectedAsTarget: boolean
  ): Partial<React.CSSProperties> {
    const strokeWidth = 1;
    let stroke = "#3ab5fc";
    let strokeDasharray = "";
    let fill = "#3ab5fc";

    if (connectedAsSource || connectedAsTarget) {
      fill = "#3ab5fc";
    }

    // if (
    // Bitset.has(
    //     GraphPortStatus.Activated |
    //     GraphPortStatus.Selected |
    //     GraphPortStatus.Connecting
    // )(port.status)
    // ) {
    // fill = "#3399ff";
    // stroke = "#3399ff";
    // }

    if (Bitset.has(GraphPortStatus.Connecting)(port.status)) {
      switch (isConnectable) {
        case true:
          fill = "lightblue";
          stroke = "#0078D4";
          strokeDasharray = "3,2";
          break;
        case false:
          fill = "#E1DFDD";
        // if (Bitset.has(GraphPortStatus.Activated)(port.status)) {
        //     stroke = "#B3B0AD";
        // }
        // break;
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
  const state = useGraphState();
  useMemo(async () => {
    if (Bitset.has(GraphPortStatus.Selected)(port.status)) {
      // construct the prompt
      if (!parentNode?.ports) return;
      const edges = state.state.data.present.getEdgesByTarget(
        parentNode.id,
        parentNode.ports[0].id
      );
      if (!edges) return;
      const edgeId = edges.values().next().value;
      const edge = state.state.data.present.edges.get(edgeId);
      if (!edge) return;
      console.log("edge", edge);
      const sourceNode = state.state.data.present.nodes.get(edge.source);
      console.log("sourceNode", sourceNode?.name);
      let prompt = `${parentNode.name} with relation to ${sourceNode?.name}`;
      prompt = prompt.replace(/_/g, " ");
      const res = await axios.post(`/graph/${prompt}/api`);
      const subtopics: string[] = Object.values(res.data);
      state.dispatch({
        type: GraphCanvasEvent.UpdateData,
        shouldRecord: false,
        updater(prevData) {
          return addGraphData(prevData, parentNode, subtopics);
        },
      });
    }
  }, [port.status]);

  const renderCircle = (
    r: number,
    circleStyle: Partial<React.CSSProperties>
  ): React.ReactNode => {
    return (
      <>
        <circle r={r} cx={x} cy={y} style={circleStyle} />
        <line
          x1={x}
          y1={y - r + 5}
          x2={x}
          y2={y + r - 5}
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth={3}
        />
        <line
          x1={x - r + 5}
          y1={y}
          x2={x + r - 4}
          y2={y}
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth={3}
        />
      </>
    );
  };
  if (port.isOutputDisabled || port.isInputDisabled) return null;
  return (
    <g opacity={"100%"} cursor={"pointer"}>
      <>{renderCircle(10, style)}</>
      <circle r={RADIUS} fill="transparent" cx={x} cy={y} />
    </g>
  );
};
