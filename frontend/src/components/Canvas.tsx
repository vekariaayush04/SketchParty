import { useRef, useState, useEffect } from 'react'
import { socket } from '../socket'

type DrawingEvent = {
  Drawingtype: 'start' | 'draw' | 'end' | 'clear'
  x: number
  y: number
  color: string
}

export default function Canvas({ isdrawing }: { isdrawing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isVisualMode, setIsVisualMode] = useState(!isdrawing)
  const [color, setColor] = useState('#000000')

  useEffect(() => {
    setIsVisualMode(!isdrawing)
    clearCanvas()
  }, [isdrawing])

  useEffect(() => {
    const handleRemoteDrawing = (data: DrawingEvent) => {
      draw(data)
    }
    
    socket.on('drawEvent', handleRemoteDrawing)

    return () => {
      socket.off('drawEvent', handleRemoteDrawing)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDown = (e: MouseEvent) => {
      if (isVisualMode) return
      setIsDrawing(true)
      const { offsetX, offsetY } = e
      drawAndEmit('start', offsetX, offsetY, color)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing || isVisualMode) return
      const { offsetX, offsetY } = e
      drawAndEmit('draw', offsetX, offsetY, color)
    }

    const handleMouseUp = () => {
      if (isVisualMode) return
      setIsDrawing(false)
      drawAndEmit('end', 0, 0, color)
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDrawing, isVisualMode, color])

  const drawAndEmit = (Drawingtype: DrawingEvent['Drawingtype'], x: number, y: number, color: string) => {
    const event: DrawingEvent = { Drawingtype, x, y, color }
    draw(event)
    if (socket) {
      socket.emit('message', {
        type: 'drawEvent',
        event: event,
      })
    }
  }

  const draw = (event: DrawingEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = event.color

    switch (event.Drawingtype) {
      case 'start':
        ctx.beginPath()
        ctx.moveTo(event.x, event.y)
        break
      case 'draw':
        ctx.lineTo(event.x, event.y)
        ctx.stroke()
        break
      case 'end':
        ctx.closePath()
        break
      case 'clear':
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        break
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (socket) {
      socket.emit('message', {
        type: 'drawEvent',
        event: { Drawingtype: 'clear', x: 0, y: 0, color: '' },
      })
    }
  }

  return (
    <div className="flex flex-col items-center  p-4 mt-4">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="border border-gray-300 rounded-lg"
      />
      {isdrawing && (
        <div className="flex items-center space-x-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded-full"
        />
        <button onClick={clearCanvas}>Clear Canvas</button>
      </div>
      )}
    </div>
  )
}
