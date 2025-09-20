import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  ReactFlowProvider,
  useReactFlow,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Hash, Type, Layers, FileText, AlertCircle, Plus, Minus, Brackets, Braces, ToggleLeft } from 'lucide-react';
import { getSchemaType } from '../utils/schemaParser';

const typeIcons = {
  string: <Type className="w-3 h-3 text-green-500" />,
  number: <Hash className="w-3 h-3 text-blue-500" />,
  integer: <Hash className="w-3 h-3 text-blue-500" />,
  boolean: <ToggleLeft className="w-3 h-3 text-purple-500" />,
  array: <Brackets className="w-3 h-3 text-orange-500" />,
  object: <Braces className="w-3 h-3 text-indigo-500" />,
  enum: <Layers className="w-3 h-3 text-pink-500" />,
  const: <FileText className="w-3 h-3 text-teal-500" />,
  reference: <AlertCircle className="w-3 h-3 text-yellow-500" />,
  any: <AlertCircle className="w-3 h-3 text-gray-500" />,
};

const SchemaNode = ({ data, isConnectable }) => {
  const { name, schema, onExpand, isExpanded, hasChildren, childCount } = data;
  const type = getSchemaType(schema);

  // Determine node color based on type
  const getNodeColor = () => {
    switch (type) {
      case 'object': return 'bg-blue-50 border-blue-300';
      case 'array': return 'bg-orange-50 border-orange-300';
      case 'string': return 'bg-green-50 border-green-300';
      case 'number':
      case 'integer': return 'bg-purple-50 border-purple-300';
      case 'boolean': return 'bg-pink-50 border-pink-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  const formatDisplayName = (name, schema) => {
    if (schema.$ref) {
      return `${name}`;
    }
    if (type !== 'object' && type !== 'array') {
      return `${name}:${type}`;
    }
    return name;
  };

  return (
    <div 
      className={`rounded-lg border-2 shadow-sm ${getNodeColor()} min-w-[140px] ${hasChildren ? 'cursor-pointer hover:shadow-lg' : ''} transition-all duration-200 relative group`}
      onClick={() => hasChildren && onExpand()}
      title={schema.description || ''}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#64748b', width: 8, height: 8 }}
      />
      <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          {typeIcons[type] || typeIcons.any}
          <div className="flex-1">
            <div className="text-sm font-medium">
              {formatDisplayName(name, schema)}
            </div>
            {schema.$ref && (
              <div className="text-xs text-gray-500">
                {schema.$ref.split('/').pop()}
              </div>
            )}
          </div>
          {hasChildren && (
            <button 
              className="p-1 rounded hover:bg-white/50"
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
            >
              {isExpanded ? 
                <Minus className="w-3 h-3" /> : 
                <Plus className="w-3 h-3" />
              }
            </button>
          )}
        </div>
        {childCount > 0 && !isExpanded && (
          <div className="text-xs text-gray-500 mt-1">
            {childCount} properties
          </div>
        )}
      </div>
      {/* Tooltip for description */}
      {schema.description && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-white text-gray-700 text-sm rounded-lg shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 min-w-[400px] max-w-[400px] whitespace-normal">
          <div className="leading-relaxed">{schema.description}</div>
          {/* Elegant arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white"></div>
            <div className="absolute -top-[1px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-t-[7px] border-transparent border-t-gray-200"></div>
          </div>
        </div>
      )}
      {hasChildren && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#64748b', width: 8, height: 8 }}
        />
      )}
    </div>
  );
};

const nodeTypes = {
  schemaNode: SchemaNode,
};

const SchemaGraphInner = ({ schema, rootSchema }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root']));
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { fitView } = useReactFlow();

  const resolveRef = useCallback((ref) => {
    if (!ref || !ref.startsWith('#')) return null;
    
    const parts = ref.split('/').slice(1);
    let current = rootSchema || schema;
    
    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        return null;
      }
    }
    
    return current;
  }, [rootSchema, schema]);

  // Function to focus on a specific node
  const focusOnNode = useCallback((nodeId) => {
    setTimeout(() => {
      fitView({ 
        nodes: [{ id: nodeId }], 
        duration: 500, 
        padding: 10 
      });
    }, 100);
  }, [fitView]);

  // Helper to calculate horizontal tree layout positions
  const calculateHorizontalLayout = useCallback((tree) => {
    const positions = new Map();
    const levelGap = 250; // Horizontal gap between levels
    const nodeGap = 80; // Vertical gap between nodes
    
    // First pass: calculate heights needed for each subtree
    const calculateSubtreeHeight = (node) => {
      if (!node.children || node.children.length === 0) {
        return 1;
      }
      return node.children.reduce((sum, child) => sum + calculateSubtreeHeight(child), 0);
    };
    
    // Second pass: position nodes
    const layoutNode = (node, x = 0, y = 0) => {
      positions.set(node.id, { x, y });
      
      if (node.children && node.children.length > 0) {
        const childHeights = node.children.map(calculateSubtreeHeight);
        const totalHeight = childHeights.reduce((sum, h) => sum + h, 0);
        
        // Start position for first child
        let currentY = y - ((totalHeight - 1) * nodeGap) / 2;
        
        node.children.forEach((child, index) => {
          const childHeight = childHeights[index];
          const childY = currentY + ((childHeight - 1) * nodeGap) / 2;
          
          layoutNode(child, x + levelGap, childY);
          
          currentY += childHeight * nodeGap;
        });
      }
    };
    
    layoutNode(tree);
    return positions;
  }, []);

  const buildTree = useCallback(() => {
    let nodeCounter = 0;
    const nodeMap = new Map();
    
    const addNode = (nodeSchema, nodeName, level = 0) => {
      const nodeId = level === 0 ? 'root' : `node-${nodeCounter++}`;
      const resolvedSchema = nodeSchema.$ref ? resolveRef(nodeSchema.$ref) || nodeSchema : nodeSchema;
      const isExpanded = expandedNodes.has(nodeId);
      
      // Count potential children
      const potentialChildren = [];
      
      if (resolvedSchema.properties) {
        Object.keys(resolvedSchema.properties).forEach(key => {
          potentialChildren.push({ key, type: 'property' });
        });
      }
      
      if (resolvedSchema.items) {
        potentialChildren.push({ key: '[items]', type: 'items' });
      }
      
      if (resolvedSchema.oneOf) {
        resolvedSchema.oneOf.forEach((_, index) => {
          potentialChildren.push({ key: `oneOf[${index}]`, type: 'oneOf' });
        });
      }
      
      if (resolvedSchema.anyOf) {
        resolvedSchema.anyOf.forEach((_, index) => {
          potentialChildren.push({ key: `anyOf[${index}]`, type: 'anyOf' });
        });
      }
      
      if (resolvedSchema.allOf) {
        resolvedSchema.allOf.forEach((_, index) => {
          potentialChildren.push({ key: `allOf[${index}]`, type: 'allOf' });
        });
      }
      
      const node = {
        id: nodeId,
        name: nodeName,
        schema: resolvedSchema,
        level,
        children: [],
        hasChildren: potentialChildren.length > 0,
        childCount: potentialChildren.length,
        isExpanded,
      };
      
      nodeMap.set(nodeId, node);
      
      // Only add children if expanded
      if (isExpanded && potentialChildren.length > 0) {
        potentialChildren.forEach(({ key, type }) => {
          let childSchema;
          
          switch (type) {
            case 'property':
              childSchema = resolvedSchema.properties[key];
              break;
            case 'items':
              childSchema = resolvedSchema.items;
              break;
            case 'oneOf':
              const oneOfIndex = parseInt(key.match(/\[(\d+)\]/)[1]);
              childSchema = resolvedSchema.oneOf[oneOfIndex];
              break;
            case 'anyOf':
              const anyOfIndex = parseInt(key.match(/\[(\d+)\]/)[1]);
              childSchema = resolvedSchema.anyOf[anyOfIndex];
              break;
            case 'allOf':
              const allOfIndex = parseInt(key.match(/\[(\d+)\]/)[1]);
              childSchema = resolvedSchema.allOf[allOfIndex];
              break;
          }
          
          if (childSchema) {
            const childNode = addNode(childSchema, key, level + 1);
            node.children.push(childNode);
          }
        });
      }
      
      return node;
    };
    
    return addNode(schema, 'root');
  }, [schema, expandedNodes, resolveRef]);

  const generateNodes = useCallback(() => {
    const tree = buildTree();
    const positions = calculateHorizontalLayout(tree);
    
    const newNodes = [];
    const newEdges = [];
    
    const traverse = (node) => {
      const pos = positions.get(node.id);
      
      newNodes.push({
        id: node.id,
        type: 'schemaNode',
        position: pos,
        data: {
          name: node.name,
          schema: node.schema,
          level: node.level,
          hasChildren: node.hasChildren,
          childCount: node.childCount,
          isExpanded: node.isExpanded,
          onExpand: () => {
            setExpandedNodes(prev => {
              const next = new Set(prev);
              const wasExpanded = next.has(node.id);
              if (wasExpanded) {
                next.delete(node.id);
              } else {
                next.add(node.id);
              }
              // Focus on the node whether expanding or collapsing
              setTimeout(() => focusOnNode(node.id), 150);
              return next;
            });
          },
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
      
      // Add edges to children
      node.children.forEach(child => {
        newEdges.push({
          id: `edge-${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'smoothstep',
          style: { 
            stroke: '#64748b', 
            strokeWidth: 2,
          },
          markerEnd: {
            type: 'arrowclosed',
            width: 20,
            height: 20,
            color: '#64748b',
          },
        });
        
        traverse(child);
      });
    };
    
    traverse(tree);
    
    return { nodes: newNodes, edges: newEdges };
  }, [buildTree, calculateHorizontalLayout, setExpandedNodes, focusOnNode]);

  // Update nodes and edges when expandedNodes changes
  useLayoutEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateNodes();
    setNodes(newNodes);
    setEdges(newEdges);
    
    // Only fit view on initial load
    if (isInitialLoad) {
      setTimeout(() => {
        fitView({ duration: 300 });
        setIsInitialLoad(false);
      }, 100);
    }
  }, [generateNodes, setNodes, setEdges, fitView, isInitialLoad]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 50 }}
      minZoom={0.1}
      maxZoom={2}
      attributionPosition="bottom-left"
    >
      <Controls />
      <MiniMap
        nodeColor={(node) => {
          const type = node.data?.schema ? getSchemaType(node.data.schema) : 'any';
          const colors = {
            string: '#10b981',
            number: '#8b5cf6',
            integer: '#8b5cf6',
            boolean: '#ec4899',
            array: '#f59e0b',
            object: '#3b82f6',
            enum: '#ec4899',
            const: '#14b8a6',
            reference: '#eab308',
            any: '#6b7280',
          };
          return colors[type] || colors.any;
        }}
        maskColor="rgb(250, 250, 250, 0.8)"
        position="bottom-right"
      />
      <Background color="#e5e7eb" gap={20} size={1} />
    </ReactFlow>
  );
};

const SchemaGraph = (props) => {
  return (
    <div className="w-full h-full">
      <ReactFlowProvider>
        <SchemaGraphInner {...props} />
      </ReactFlowProvider>
    </div>
  );
};

export default SchemaGraph;