import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

function CustomNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-[1px] border-gray-900">
      <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
          s
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.name}</div>
          <div className="text-gray-500">{data.job}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 rounded-full !bg-gray-900 h-2 "
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 rounded-full !bg-gray-900 h-2"
      />
    </div>
  );
}

export default memo(CustomNode);
