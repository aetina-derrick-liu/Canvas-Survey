
import { useRef, useEffect } from 'react'

const useCanvas = (draw: (ctx: any, frameCount: number) => void) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas: any = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId: number

    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return canvasRef
}

export default useCanvas
