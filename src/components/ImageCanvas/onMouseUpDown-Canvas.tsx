import React, { useEffect, useRef, useState } from 'react'
import pigSrc from '../../assets/pig.jpg'

const CanvasComponent = () => {
  const canvasRef = useRef(null)
  const [rectangles, setRectangles] = useState([])
  const [selectedRect, setSelectedRect] = useState(null)
  const [startPoint, setStartPoint] = useState(null)
  const [currentRect, setCurrentRect] = useState(null)
  const img = useRef(null)

  useEffect(() => {
    // 只在組件加載時加載圖片
    img.current = new Image()
    img.current.src = pigSrc // 替換你的圖片URL
    img.current.onload = () => {
      // 畫圖片到canvas
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img.current, 0, 0, ctx.canvas.width, ctx.canvas.height)
    }
  }, [])

  const draw = (ctx, frameCount) => {
    // 清空畫布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // 畫圖片到canvas
    ctx.drawImage(img.current, 0, 0, ctx.canvas.width, ctx.canvas.height)

    // 畫矩形
    rectangles.forEach((rect, index) => {
      ctx.beginPath()
      ctx.rect(rect.x, rect.y, rect.width, rect.height)
      if (index === selectedRect) {
        // 有邊框
        ctx.strokeStyle = 'rgba(255, 0, 0, 1)' // 紅色，100%透明度
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)' // 紅色，50%透明度
      } else {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)' // 紅色，50%透明度
        // 沒有邊框
        ctx.strokeStyle = 'rgba(255, 0, 0, 0)'
      }
      ctx.fill()
      ctx.stroke()

      // 畫標籤
      ctx.fillStyle = 'black'
      ctx.fillRect(rect.x, rect.y, ctx.measureText('Pig').width + 10, 20) // 在文字周圍留出一些邊距
      ctx.fillStyle = 'white'
      ctx.font = '16px Arial'
      ctx.fillText('Pig', rect.x + 5, rect.y + 15) // 文字留出一些邊距
    })

    // 繪製當前的預覽矩形
    if (currentRect) {
      ctx.beginPath()
      ctx.rect(currentRect.x, currentRect.y, currentRect.width, currentRect.height)
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)' // 紅色，50%透明度
      ctx.fill()
    }
  }

  const startDrawing = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setStartPoint({ x, y })
  }
  const selectRect = (event) => {
    const canvas = canvasRef.current
    console.log(canvas)
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const selected = rectangles.findIndex(rect =>
      x >= rect.x && x <= rect.x + rect.width &&
            y >= rect.y && y <= rect.y + rect.height)
    console.log(selected)
    setSelectedRect(selected)
  }

  const drawPreview = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (startPoint) {
      setCurrentRect({
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        width: Math.abs(x - startPoint.x),
        height: Math.abs(y - startPoint.y)
      })
    }
  }

  const endDrawing = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const width = Math.abs(x - startPoint.x)
    const height = Math.abs(y - startPoint.y)

    if (width > 50 && height > 50) { // 檢查矩形的大小
      setRectangles([...rectangles, {
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        width,
        height
      }])
    }

    setStartPoint(null)
    setCurrentRect(null) // 繪製完成後，將當前預覽矩形設為null
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId

    // Render function
    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw, rectangles, currentRect])

  useEffect(() => {
    const handleDelete = (event) => {
      console.log(event.key)
      if (event.key === 'Delete' && selectedRect !== -1) {
        console.log('delete')
        setRectangles(rectangles.filter((_, index) => index !== selectedRect))
        setSelectedRect(-1)
      }
    }
    window.addEventListener('keydown', handleDelete)

    return () => {
      window.removeEventListener('keydown', handleDelete)
    }
  }, [selectedRect, rectangles])

  return <canvas onMouseDown={startDrawing} onMouseUp={endDrawing} onClick={selectRect} onMouseMove={drawPreview} ref={canvasRef} width="500px" height="500px"/>
}

export default CanvasComponent
