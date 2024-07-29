import React, { useContext } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
} from '@xyflow/react';

import '@xyflow/react/dist/base.css';
import dagre from '@dagrejs/dagre';
import CustomNode from './CustomNode';
import AuthContext from '../auth/AuthContext';

const nodeTypes = {
  custom: CustomNode,
};
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 300;
const nodeHeight = 200;

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  // Assuming dagreGraph supports batch updates, if not, this step remains unchanged
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Optimized to reduce the mapping overhead by combining operations
  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes as never[], edges };
};

const proOptions = { hideAttribution: true };

function Flow() {
  const [nodes, setNode, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { authTokens } = useContext(AuthContext);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch(`${process.env.CRM_URL}/api/hierarchy/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens?.access}`,
          },
        });
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
  }, [authTokens?.access, setEdges, setNode]);

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
