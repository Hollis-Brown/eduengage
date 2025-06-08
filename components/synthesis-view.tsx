"use client"

import { useState } from "react"
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Lightbulb, CheckCircle, List, HelpCircle } from "lucide-react"
import type { DiscussionSynthesis, SynthesisNode as SynthesisNodeType } from "@/lib/ai-service"

// Custom node types
const nodeTypes = {
  mindMapNode: MindMapNodeComponent,
}

interface SynthesisViewProps {
  synthesis: DiscussionSynthesis
}

export function SynthesisView({ synthesis }: SynthesisViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [showSparkOfGenius, setShowSparkOfGenius] = useState(false)
  const [activeTab, setActiveTab] = useState("mindMap")

  // Convert mind map data to ReactFlow nodes and edges
  useState(() => {
    if (!synthesis?.mindMap) return

    // Create nodes
    const flowNodes: Node[] = synthesis.mindMap.nodes.map((node, index) => ({
      id: node.id,
      type: "mindMapNode",
      position: getNodePosition(node.id, index, synthesis.mindMap.nodes.length),
      data: {
        ...node,
      },
    }))

    // Create edges
    const flowEdges: Edge[] = synthesis.mindMap.edges.map((edge, index) => ({
      id: `edge-${index}`,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { stroke: "#3B82F6", strokeWidth: 2 },
    }))

    setNodes(flowNodes)
    setEdges(flowEdges)
  })

  // Simple positioning algorithm
  const getNodePosition = (id: string, index: number, totalNodes: number) => {
    // Central node at center
    if (id === "central") {
      return { x: 250, y: 250 }
    }

    // Other nodes in a circle around the central node
    const radius = 200
    const angle = (2 * Math.PI * index) / (totalNodes - 1)

    return {
      x: 250 + radius * Math.cos(angle),
      y: 250 + radius * Math.sin(angle),
    }
  }

  // Show spark of genius
  const handleShowSparkOfGenius = () => {
    setShowSparkOfGenius(true)

    // Hide after 10 seconds
    setTimeout(() => {
      setShowSparkOfGenius(false)
    }, 10000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{synthesis.title}</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Created {new Date(synthesis.createdAt).toLocaleDateString()}
          </p>
        </div>

        <Button onClick={handleShowSparkOfGenius} className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          <span>Spark of Genius</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discussion Summary</CardTitle>
          <CardDescription>{synthesis.summary}</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="mindMap" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Mind Map</span>
          </TabsTrigger>
          <TabsTrigger value="keyPoints" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Key Points</span>
          </TabsTrigger>
          <TabsTrigger value="actionItems" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Action Items</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>Questions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mindMap">
          <Card>
            <CardContent className="p-0">
              <div className="w-full h-[500px] border rounded-lg bg-white dark:bg-gray-800">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  nodeTypes={nodeTypes}
                  fitView
                >
                  <Background color="#aaa" gap={16} />
                  <Controls />
                  <MiniMap />
                </ReactFlow>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keyPoints">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                <span>Key Points</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {synthesis.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1 min-w-4">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actionItems">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Action Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {synthesis.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                <span>Questions to Explore</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {synthesis.questions.map((question, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {showSparkOfGenius && (
          <motion.div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-xl w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-glow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                  <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Spark of Genius</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 dark:text-gray-200 font-mono">
                  What if you applied these concepts to create a solar-powered art installation that visualizes energy
                  consumption patterns in real-time? This could bridge science, art, and sustainability in an unexpected
                  way.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" onClick={() => setShowSparkOfGenius(false)}>
                  Capture This Idea
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Custom node component for mind map nodes
function MindMapNodeComponent({ data }: NodeProps<SynthesisNodeType>) {
  const isCentral = data.id === "central"

  return (
    <div
      className={`px-4 py-2 rounded-md ${
        isCentral
          ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-600 dark:border-blue-400"
          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />

      <div className="font-medium text-sm">{data.label}</div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  )
}
