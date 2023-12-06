import {
  Bitset,
  GraphNodeStatus,
  INodeConfig,
  getRectHeight,
  getRectWidth,
  INodeDrawArgs,
} from "react-dag-editor";
import React, { useEffect } from "react";

export const NodeConfig: INodeConfig = {
  // min height constraint for node resizing.
  getMinHeight: () => 60,
  // min width constraint for node resizing.
  getMinWidth: () => 100,
  // render decides the element to represent a node
  render(args: INodeDrawArgs): React.ReactNode {
    return (
      <Node
        selected={Bitset.has(GraphNodeStatus.Selected)(args.model.status)}
        args={args}
      />
    );
  },
};

const Node = ({
  selected,
  args,
}: {
  selected: boolean;
  args: INodeDrawArgs;
}) => {
  let height = getRectHeight(NodeConfig, args.model);
  let width = getRectWidth(NodeConfig, args.model);
  let name = args.model.inner.name ?? "";
  let posx = args.model.x;
  let posy = args.model.y;
  let offset = 0;
  if (name.length > 10) {
    offset = (name.length - 10) * 5;
  }
  const stroke = selected ? "#39a3ef" : "lightgrey";

  return (
    <>
      <rect
        x={posx}
        y={posy}
        width={width}
        height={height}
        rx="15"
        fill="white"
        shapeRendering={"geometricPrecision"}
        stroke={stroke}
        strokeWidth={2}
        onClick={(e) => {}}
      />
      <foreignObject
        x={posx}
        y={posy}
        width={width}
        height={height}
        cursor={"pointer"}
      >
        <div
          style={{
            display: "flex",
            height: height,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ textAlign: "center", lineHeight: 1 }}>{name}</p>
        </div>
      </foreignObject>
    </>
  );
};
