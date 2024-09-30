import { useRef, useState, useEffect } from 'react'
import { socket } from '../socket'

type DrawingEvent = {
  type: 'start' | 'draw' | 'end' | 'clear'
  x: number
  y: number
  color: string
}

export default function Canvas({ isdrawing }: { isdrawing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2

    const handleDrawEvent = (event: DrawingEvent) => {
      switch (event.type) {
        case 'start':
          ctx.beginPath()
          ctx.moveTo(event.x, event.y)
          break
        case 'draw':
          ctx.lineTo(event.x, event.y)
          ctx.strokeStyle = event.color
          ctx.stroke()
          break
        case 'clear':
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          break
      }
    }

    socket.on('drawEvent', handleDrawEvent)

    return () => {
      socket.off('drawEvent', handleDrawEvent)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()

    const handleStart = (e: MouseEvent | TouchEvent) => {
      if (!isdrawing) return
      setIsDrawing(true)
      const { clientX, clientY } = 'touches' in e ? e.touches[0] : e
      const x = clientX - rect.left
      const y = clientY - rect.top
      emitDrawEvent('start', x, y)
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || !isdrawing) return
      const { clientX, clientY } = 'touches' in e ? e.touches[0] : e
      const x = clientX - rect.left
      const y = clientY - rect.top
      emitDrawEvent('draw', x, y)
    }

    const handleEnd = () => {
      if (!isdrawing) return
      setIsDrawing(false)
      emitDrawEvent('end', 0, 0)
    }

    canvas.addEventListener('mousedown', handleStart)
    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('mouseup', handleEnd)
    canvas.addEventListener('mouseout', handleEnd)
    canvas.addEventListener('touchstart', handleStart)
    canvas.addEventListener('touchmove', handleMove)
    canvas.addEventListener('touchend', handleEnd)

    return () => {
      canvas.removeEventListener('mousedown', handleStart)
      canvas.removeEventListener('mousemove', handleMove)
      canvas.removeEventListener('mouseup', handleEnd)
      canvas.removeEventListener('mouseout', handleEnd)
      canvas.removeEventListener('touchstart', handleStart)
      canvas.removeEventListener('touchmove', handleMove)
      canvas.removeEventListener('touchend', handleEnd)
    }
  }, [isdrawing, isDrawing])

  const emitDrawEvent = (type: DrawingEvent['type'], x: number, y: number) => {
    const event: DrawingEvent = { type, x, y, color };
    socket.emit('drawEvent', event);  // Make sure this matches the server listener
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    emitDrawEvent('clear', 0, 0)
  }

  return (
    <div className="rounded-lg mt-5">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="border border-gray-300 rounded-lg w-80 h-80 md:w-[500px] md:h-[500px]"
      />
      {isdrawing && (
        <div className="flex items-center space-x-4 justify-center pt-5">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-full"
          />
          <button onClick={clearCanvas} className="px-4 py-2 bg-red-500 text-white rounded">Clear Canvas</button>
        </div>
      )}
    </div>
  )
}
