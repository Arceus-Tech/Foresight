import React from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
} from '@xyflow/react';

import '@xyflow/react/dist/base.css';
import dagre from '@dagrejs/dagre';
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 400;
const nodeHeight = 100;

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes as never[], edges };
};

const proOptions = { hideAttribution: true };

function Flow() {
  const [nodes, setNode, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch('http://127.0.0.1:8000/api/hierarchy/');
        const data1 = await response1.json();

        // Process nodes (Optional: Include handles if needed)
        const nodesData = data1.nodes.map((node: { id: any }) => {
          return {
            ...node,
            id: String(node.id),
          };
        });

        // Process edges as before (ensure consistent IDs)
        const edgesData = data1.edges.map(
          (edge: { source: any; target: any }) => ({
            ...edge,
            source: String(edge.source),
            target: String(edge.target),
          }),
        );
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(nodesData, edgesData);

        setNode(layoutedNodes as never[]);
        setEdges(layoutedEdges as never[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setEdges, setNode]);

  return (
    <div className=" absolute h-screen w-full">
      {nodes && edges && (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          fitView
          className="bg-gray-50"
          nodesDraggable={false}
          edgesReconnectable={false}
        >
          <Controls />
        </ReactFlow>
      )}
    </div>
  );
}

export default Flow;
