import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ImageDemo: React.FC<any> = () => {
  const rows = useMemo(() => 10, []);
  const columns = useMemo(() => 20, []);
  const boxWidth = useRef<number>(0);
  const boxHeight = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const counter = useRef<number>(0);
  const { current: image } = useRef(new Image());
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const animate = useCallback(() => {
    const x = Math.floor(Math.random() * columns);
    const y = Math.floor(Math.random() * rows);
    if (!canvasContextRef.current) {
      if (canvasRef.current) {
        canvasContextRef.current = canvasRef.current?.getContext("2d");
      }
    }
    if (canvasContextRef.current) {
      canvasContextRef.current.drawImage(
        image,
        x * boxWidth.current,
        y * boxHeight.current,
        boxWidth.current,
        boxHeight.current,
        x * boxWidth.current,
        y * boxHeight.current,
        boxWidth.current,
        boxHeight.current
      );
      counter.current++;
      if (counter.current > columns * rows * 0.95) {
        canvasContextRef.current?.drawImage(image, 0, 0);
      } else {
        requestAnimationFrame(animate);
      }
    }
  }, [columns, image, rows]);
  const init = useCallback(() => {
    image.src = "https://cd-user-upload.hongsong.club/panda/test1.jpg";
    let counter = 0;
    image.onload = () => {
      setCanvasWidth(image.width);
      setCanvasHeight(image.height);
      boxWidth.current = image.width / columns;
      boxHeight.current = image.height / rows;
      requestAnimationFrame(animate);
    };
  }, [animate, columns, image, rows]);
  useEffect(() => {
    init();
  }, []);
  const reRender = useCallback(() => {
    if (canvasContextRef.current) {
      canvasContextRef.current?.clearRect(0, 0, canvasWidth, canvasHeight);
      counter.current = 0;
      requestAnimationFrame(animate);
    }
  }, [animate, canvasHeight, canvasWidth]);
  return (
    <canvas
      onClick={reRender}
      ref={canvasRef}
      id={"imageDemoCanvas"}
      width={canvasWidth}
      height={canvasHeight}
      style={{ backgroundColor: "black" }}
    />
  );
};

export default ImageDemo;
