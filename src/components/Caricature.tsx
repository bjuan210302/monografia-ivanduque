import { Canvas } from "@react-three/fiber";
import { createRef, useEffect, useRef, useState } from "react";
import { groupBy } from "../utils/utils";
import { ConnectedPoint, Nodes } from "./PointHighlight";

const pointsGroups = [
    {
        name: 'nariz',
        x: 0.3233082706766917,
        y: 0.34754797441364604,
        color: 'red',
        group: 'cerdo'
    },
    {
        name: 'frente',
        x: 0.4398496240601504,
        y: 0.2515991471215352,
        color: 'red',
        group: 'cerdo'
    },
    {
        name: 'oreja',
        x: 0.5169172932330827,
        y: 0.2878464818763326,
        color: 'red',
        group: 'cerdo'
    },
    {
        name: 'pesuna',
        x: 0.5620300751879699,
        y: 0.6417910447761194,
        color: 'red',
        group: 'cerdo'
    },
    {
        name: 'cola',
        x: 0.6353383458646616,
        y: 0.744136460554371,
        color: 'red',
        group: 'cerdo'
    },
    {
        name: 'cochino',
        x: 0.6616541353383458,
        y: 0.44776119402985076,
        color: 'red',
        group: 'cerdo'
    },
    {
        name: 'cabello',
        x: 0.4793233082706767,
        y: 0.21748400852878466,
        color: 'green',
        group: 'duque'
    },
    {
        name: 'nariz',
        x: 0.36466165413533835,
        y: 0.3646055437100213,
        color: 'green',
        group: 'duque'
    },
    {
        name: 'corbata',
        x: 0.41353383458646614,
        y: 0.6076759061833689,
        color: 'green',
        group: 'duque'
    },
    {
        name: 'croc',
        x: 0.5,
        y: 0.8805970149253731,
        color: 'blue',
        group: 'uribismo'
    },
    {
        name: 'dialogo',
        x: 0.8289473684210527,
        y: 0.3624733475479744,
        color: 'blue',
        group: 'uribismo'
    },
]

// const points = pointsGroups.map(g => g.points.map())
export function Caricature() {

    const [width, setWindowWidth] = useState(window.innerWidth * 0.55)
    const [points, setPoints] = useState<JSX.Element[]>()
    const canvasContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!canvasContainerRef.current)
            return

        const groupedPoints = groupBy(pointsGroups, 'group')
        const groupKeys = Object.keys(groupedPoints)


        const generatedPoints = groupKeys.map(groupName => {

            let curr = createRef<typeof ConnectedPoint>()
            let bef: typeof curr[]
            return (
                <Nodes key={`asdasda-${groupName}`} color={groupedPoints[groupName][0].color}>
                    {
                        groupedPoints[groupName].map(
                            (point, index) => {
                                let canvas = canvasContainerRef.current!
                                const originalXPercent = point.x
                                const originalYPercent = point.y
                                const adaptedX = (originalXPercent - 1 / 2) * canvas.offsetWidth
                                const adaptedY = (1 / 2 - originalYPercent) * canvas.offsetHeight
                                const normalizedX = (adaptedX / canvas.offsetWidth) * 9
                                const normalizedY = (adaptedY / canvas.offsetHeight) * 7.7

                                bef = bef ? [...bef] : []
                                const el = <ConnectedPoint
                                    ref={curr} color={point.color} position={[normalizedX, normalizedY, 0]}
                                    connectedTo={bef}
                                    key={`pm-${index}`}
                                />
                                bef = [curr]
                                curr = createRef<typeof ConnectedPoint>()
                                return el
                            }
                        )
                    }
                </Nodes>
            )
        })

        setPoints(generatedPoints)
    }, [canvasContainerRef]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth * 0.55)
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const imageContainerBounds = {
        width: width + 'px',
        height: (width * 0.882352941) + 'px'
    }

    const canvasOptions = {
        params: {
            Points: { threshold: 0.16 },
        }
    }

    return (
        <div className="h-screen bg-neutral-300">
            <div ref={canvasContainerRef} className="m-auto" style={imageContainerBounds}>
                <Canvas className="image-container"
                    // @ts-ignore
                    raycaster={canvasOptions}>
                    {points}
                </Canvas>

            </div>
        </div>
    )
}