import { QuadraticBezierLine } from '@react-three/drei'
import { Object3DNode, useFrame } from '@react-three/fiber'
import { RefObject, createContext, forwardRef, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Group, Mesh, Vector3 } from 'three'

const context = createContext<any>({} as any)

export function Nodes({ children, color }: { children: any[], color: string }) {
    const group = useRef<Group>(null)
    const [nodes, set] = useState<PointProps[]>([])

    const lines = useMemo(() => {
        const lines: any[] = []
        for (let node of nodes) {
            node.connectedTo?.map((ref) => [node.position, ref.current.position])
                .forEach(([start, end]) => lines.push(
                    { start: start.clone().add({ x: 0, y: 0, z: 0 }), end: end.clone().add({ x: 0, y: 0, z: 0 }) }
                ))
        }
        return lines
    }, [nodes])

    useFrame((_, delta) => {
        if (!group.current || !group.current.children)
            return

        group.current.children.forEach((group: any) => (group.children[0].material.uniforms.dashOffset.value -= delta * 5))
    })

    return (
        <context.Provider value={set}>
            <group ref={group}>
                {lines.map((line, index) => (
                    <group>
                        <QuadraticBezierLine key={index} {...line} color={color} dashed dashScale={10} gapSize={1} />
                        <QuadraticBezierLine key={index} {...line} color={color} lineWidth={1} transparent opacity={0.1} />
                    </group>
                ))}
            </group>
            {children}
        </context.Provider>
    )
}

type PointProps = {
    color: string, connectedTo?: RefObject<any>[], position: number[]
}
export const ConnectedPoint = forwardRef<any, PointProps>(
    ({ color = 'black', connectedTo = [], position = [0, 0, 0], ...props }, ref) => {
        const set = useContext(context)
        const [pos] = useState(() => new Vector3(...position))
        const state = useMemo(() => ({ position: pos, connectedTo }), [pos, connectedTo])
        // Register this node on mount, unregister on unmount
        useLayoutEffect(() => {
            set((nodes: any) => [...nodes, state])
            return () => void set((nodes: any) => nodes.filter((n: any) => n !== state))
        }, [state, pos])
        const [_, setHovered] = useState(false)
        return (
            <Circle ref={ref} opacity={0.3} color={color} {...props} position={pos}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}>
            </Circle>
        )
    })

interface CircleProps extends Object3DNode<Mesh, typeof Mesh> {
    children: any, opacity: number, color: string, radius?: number, segments?: number
}
const Circle = forwardRef<any, CircleProps>(
    ({ children, opacity = 1, radius = 0.1, segments = 32, color = '#ff1050', ...props }, ref) => (
        <mesh ref={ref} {...props}>
            <circleGeometry args={[radius, segments]} />
            <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={color} />
            {children}
        </mesh>
    ))