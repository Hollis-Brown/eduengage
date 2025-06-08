"use client"

import { useCallback, useEffect, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  Handle,
  MiniMap,
  type Node,
  type NodeProps,
  Position,
  useEdgesState,
  useNodesState,
} from "reactflow"
import "reactflow/dist/style.css"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Lock, CheckCircle, Video, FileQuestion, BookOpen, Dumbbell, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { LearningPathway, PathwayNode as PathwayNodeType } from "@/lib/ai-service"

// Custom node types
const nodeTypes = {
  pathwayNode: PathwayNodeComponent,
}

interface PathwayGraphProps {
  pathway: LearningPathway
  onNodeClick?: (nodeId: string) => void
  onPathwayUpdate?: (pathway: LearningPathway) => void
}

export function PathwayGraph({ pathway, onNodeClick, onPathwayUpdate }: PathwayGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [showCuriositySpark, setShowCuriositySpark] = useState(false)
  const [sparkNodeId, setSparkNodeId] = useState<string | null>(null)
  const { toast } = useToast()

  // Convert pathway data to ReactFlow nodes and edges
  useEffect(() => {
    if (!pathway) return

    // Create nodes
    const flowNodes: Node[] = pathway.nodes.map((node) => ({
      id: node.id,
      type: "pathwayNode",
      position: { x: 0, y: 0 }, // Will be positioned by layout algorithm
      data: {
        ...node,
        onClick: () => handleNodeClick(node.id),
      },
    }))

    // Create edges
    const flowEdges: Edge[] = pathway.edges.map((edge, index) => ({
      id: `edge-${index}`,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { stroke: "#3B82F6", strokeWidth: 2 },
    }))

    // Apply automatic layout
    const layoutedElements = getLayoutedElements(flowNodes, flowEdges)
    setNodes(layoutedElements.nodes)
    setEdges(layoutedElements.edges)
  }, [pathway, setNodes, setEdges])

  // Handle node click
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (onNodeClick) {
        onNodeClick(nodeId)
      }

      // Find the clicked node
      const node = pathway.nodes.find((n) => n.id === nodeId)
      if (!node || !node.unlocked) return

      // Show curiosity spark animation with 30% chance when completing a node
      if (!node.completed && Math.random() < 0.3) {
        setSparkNodeId(nodeId)
        setShowCuriositySpark(true)

        // Hide after 5 seconds
        setTimeout(() => {
          setShowCuriositySpark(false)
        }, 5000)
      }

      // Mark node as completed
      const updatedNodes = pathway.nodes.map((n) => (n.id === nodeId ? { ...n, completed: true } : n))

      // Unlock next nodes
      const connectedEdges = pathway.edges.filter((edge) => edge.source === nodeId)
      const nextNodeIds = connectedEdges.map((edge) => edge.target)

      const finalNodes = updatedNodes.map((n) => (nextNodeIds.includes(n.id) ? { ...n, unlocked: true } : n))

      // Update pathway
      const updatedPathway = {
        ...pathway,
        nodes: finalNodes,
        updatedAt: new Date().toISOString(),
      }

      if (onPathwayUpdate) {
        onPathwayUpdate(updatedPathway)
      }

      // Show toast notification
      toast({
        title: "Progress updated!",
        description: node.completed ? "You've already completed this task." : "Great job completing this task!",
      })
    },
    [pathway, onNodeClick, onPathwayUpdate, toast],
  )

  // Simple automatic layout algorithm
  const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const nodeWidth = 180
    const nodeHeight = 100
    const gapHorizontal = 100
    const gapVertical = 150

    // Find root nodes (nodes with no incoming edges)
    const targetNodeIds = edges.map((e) => e.target)
    const rootNodes = nodes.filter((node) => !targetNodeIds.includes(node.id))

    // Start with root nodes
    let currentNodes = [...rootNodes]
    let nextNodes: Node[] = []
    let level = 0

    // Position map to track which nodes have been positioned
    const positionedNodes = new Set<string>()

    // Position nodes level by level
    while (currentNodes.length > 0) {
      currentNodes.forEach((node, index) => {
        // Position the node
        node.position = {
          x: index * (nodeWidth + gapHorizontal),
          y: level * (nodeHeight + gapVertical),
        }

        // Mark as positioned
        positionedNodes.add(node.id)

        // Find child nodes
        const childEdges = edges.filter((edge) => edge.source === node.id)
        const childNodeIds = childEdges.map((edge) => edge.target)
        const childNodes = nodes.filter((n) => childNodeIds.includes(n.id) && !positionedNodes.has(n.id))

        // Add child nodes to next level
        nextNodes = [...nextNodes, ...childNodes]
      })

      // Move to next level
      currentNodes = nextNodes
      nextNodes = []
      level++
    }

    return { nodes, edges }
  }

  return (
    <div className="w-full h-[500px] border rounded-lg bg-white dark:bg-gray-800 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>

      <AnimatePresence>
        {showCuriositySpark && sparkNodeId && (
          <motion.div
            className="absolute top-4 right-4 z-10 max-w-md"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-blue-500 shadow-glow bg-blue-50 dark:bg-blue-900/20">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                  <CardTitle className="text-lg">Curiosity Spark</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-800 dark:text-gray-200 text-sm">
                  {pathway.nodes.find((n) => n.id === sparkNodeId)?.topic &&
                    `Did you know that ${pathway.nodes.find((n) => n.id === sparkNodeId)?.topic} connects to fields you might not expect? Keep exploring to discover more!`}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Custom node component for pathway nodes
function PathwayNodeComponent({ data }: NodeProps<PathwayNodeType>) {
  const getNodeIcon = () => {
    switch (data.type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "quiz":
        return <FileQuestion className="h-4 w-4" />
      case "reading":
        return <BookOpen className="h-4 w-4" />
      case "exercise":
        return <Dumbbell className="h-4 w-4" />
      case "discussion":
        return <MessageCircle className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getNodeColor = () => {
    if (!data.unlocked) return "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
    if (data.completed) return "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"

    switch (data.type) {
      case "video":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
      case "quiz":
        return "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
      case "reading":
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700"
      case "exercise":
        return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700"
      case "discussion":
        return "bg-pink-50 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700"
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
    }
  }

  return (
    <div className={`relative rounded-md border-2 w-[180px] ${getNodeColor()}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            {getNodeIcon()}
            {data.type}
          </Badge>
          {data.completed ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : !data.unlocked ? (
            <Lock className="h-4 w-4 text-gray-400" />
          ) : null}
        </div>

        <h3 className="font-medium text-sm mb-1 truncate">{data.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{data.description}</p>

        <Button
          size="sm"
          variant={data.completed ? "outline" : "default"}
          className="w-full text-xs"
          disabled={!data.unlocked}
          onClick={data.onClick}
        >
          {data.completed ? "Revisit" : data.unlocked ? "Start" : "Locked"}
        </Button>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  )
}
