import { Bitset, GraphNodeStatus, INodeConfig, getRectHeight, getRectWidth } from "react-dag-editor";

export const NodeConfig: INodeConfig = {
    // min height constraint for node resizing.
    getMinHeight: () => 60,
    // min width constraint for node resizing.
    getMinWidth: () => 100,
    // render decides the element to represent a node
    render(args): React.ReactNode {
      const height = getRectHeight(NodeConfig, args.model);
      const width = getRectWidth(NodeConfig, args.model);
  
      const fill = Bitset.has(GraphNodeStatus.Activated)(args.model.status)
        ? "red"
        : "blue";
      const stroke = Bitset.has(GraphNodeStatus.Selected)(args.model.status)
        ? "#39a3ef"
        : "lightgrey";
  
      return (
        <rect x={args.model.x} y={args.model.y} width={width} height={height} rx="15" fill="white" shapeRendering={'geometricPrecision'} stroke={stroke} strokeWidth={1} cursor={'pointer'}/>
      );
    },
  };