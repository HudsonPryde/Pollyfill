import { v4 as uuid } from 'uuid';
import * as React from 'react';
export const NODE_KEY = uuid();
export const EDGE_TYPE = 'edge';
export const NODE_TYPE = 'node';

export const nodeTypes = [NODE_TYPE];
export const edgeTypes = [EDGE_TYPE];

const NodeShape = (
  <symbol viewBox="0 0 50 25" id="node">
    <ellipse cx="50" cy="25" rx="50" ry="25" fill="red"/>
  </symbol>
);

const EdgeShape = (
  <symbol viewBox="0 0 50 50" id="edge">
    <circle cx="25" cy="25" r="8" fill="black"/>
  </symbol>
);

const graphConfig = {
  NodeTypes: {
    node: {
      typeText: 'Node',
      shapeId: '#node',
      shape: NodeShape,
    },
  },
  EdgeTypes: {
    edge: {
      shapeId: '#edge',
      shape: EdgeShape,
    },
  },
};

export default graphConfig;