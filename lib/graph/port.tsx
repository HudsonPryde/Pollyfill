import { Bitset, GraphModel, GraphNodeStatus, GraphPortStatus, ICanvasNode, ICanvasPort, IGetConnectableParams, IPortConfig, IPortDrawArgs } from "react-dag-editor";

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