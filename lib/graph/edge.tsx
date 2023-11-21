import { Bitset, GraphEdgeStatus, IEdgeConfig, IEdgeDrawArgs, getCurvePathD } from "react-dag-editor";

export const EdgeConfig: IEdgeConfig = {
    render(args: IEdgeDrawArgs): React.ReactNode {
      const edge = args.model;
      const style = {
        cursor: "pointer",
        stroke: Bitset.has(GraphEdgeStatus.Selected)(edge.status)
          ? '#39a3ef'
          : '#ccc',
        strokeWidth: "2",
      };
  
      return (
        <path
          key={edge.id}
          d={getCurvePathD(args.x2, args.x1, args.y2, args.y1)}
          fill="none"
          style={style}
          id={`edge${edge.id}`}
        />
      );
    },
}