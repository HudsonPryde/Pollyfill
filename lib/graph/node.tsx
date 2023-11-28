import { Bitset, GraphNodeStatus, INodeConfig, getRectHeight, getRectWidth, INodeDrawArgs } from "react-dag-editor";

export const NodeConfig: INodeConfig = {
    // min height constraint for node resizing.
    getMinHeight: () => 60,
    // min width constraint for node resizing.
    getMinWidth: () => 100,
    // render decides the element to represent a node
    render(args: INodeDrawArgs): React.ReactNode {
      let height = getRectHeight(NodeConfig, args.model);
      let width = getRectWidth(NodeConfig, args.model);
      let name = args.model.inner.name ?? "";
      let posx = args.model.x
      let posy = args.model.y
      let offset = 0
      if (name.length > 10) {
        offset = (name.length - 10) * 5
      }
      const stroke = Bitset.has(GraphNodeStatus.Selected)(args.model.status)
        ? "#39a3ef"
        : "lightgrey";
  
      return (
        <>
        <rect x={posx} y={posy} width={width} height={height} rx="15" fill="white" shapeRendering={'geometricPrecision'} stroke={stroke} strokeWidth={1} cursor={'pointer'} />
        <foreignObject x={posx} y={posy} width={width} height={height}>
          <div style={{display: 'flex', height: height, justifyContent: 'center', alignItems: 'center'}}>
            <p style={{textAlign: 'center', lineHeight: 1}}>{name}</p>
          </div>
        </foreignObject>
        </>
      );
    },
  };