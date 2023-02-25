import { useEffect, useState } from "react";
import { crop_image } from "../../../../pkg/hello_wasm";
import styles from "./ImageSpace.module.css";
type Props = {
  img?: string;
  imgRef: React.RefObject<HTMLImageElement>;
  onCrop: (base64: string) => void;
};
type Point = {
  x: number;
  y: number;
};
const ImageSpace = ({ onCrop, img, imgRef }: Props) => {
  const [startPoint, setStartPoint] = useState<Point>({ y: 0, x: 0 });
  const [endPoint, setEndPoint] = useState<Point>({ y: 0, x: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const imgPosition = imgRef.current?.getBoundingClientRect();
  function handleCrop() {
    const lowestX = Math.min(startPoint.x, endPoint.x);
    const lowestY = Math.min(startPoint.y, endPoint.y);
    if (img)
      onCrop(
        crop_image(
          img,
          lowestX,
          lowestY,
          Math.abs(startPoint.x - endPoint.x),
          Math.abs(startPoint.y - endPoint.y)
        )
      );
  }
  useEffect(() => {
    function handleMouseUp() {
      setIsSelecting(false);
    }
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  return (
    <div className={styles.imgContainer}>
      {!isSelecting && (
        <>
          <div
            className={styles.dragPoint}
            style={{
              top: `${startPoint.y}%`,
              left: `${startPoint.x}%`,
              cursor: "nwse-resize",
            }}
          />
          <div
            className={styles.dragPoint}
            style={{
              top: `${startPoint.y}%`,
              left: `${endPoint.x}%`,
              cursor: "nesw-resize",
            }}
          />
          <div
            className={styles.dragPoint}
            style={{
              top: `${endPoint.y}%`,
              left: `${startPoint.x}%`,
              cursor: "nesw-resize",
            }}
          />
          <div
            className={styles.dragPoint}
            style={{
              top: `${endPoint.y}%`,
              left: `${endPoint.x}%`,
              cursor: "nwse-resize",
            }}
          />
          <div className={styles.cropMenu}>
            <button onClick={() => handleCrop()}>Crop</button>
          </div>
        </>
      )}
      <div
        className={styles.crop}
        style={{
          top: `${startPoint.y}%`,
          left: `${startPoint.x}%`,
          width: `${Math.abs(startPoint.x - endPoint.x)}%`,
          height: `${Math.abs(startPoint.y - endPoint.y)}%`,
          transform: `${
            startPoint.x - endPoint.x > 0 ? "translateX(-100%)" : ""
          } ${startPoint.y - endPoint.y > 0 ? "translateY(-100%)" : ""}`,
        }}
      />
      <img
        onMouseDown={(e) => {
          if (!imgPosition) return;
          setStartPoint({
            x:
              ((e.pageX - imgPosition.x - window.scrollX) / imgPosition.width) *
              100,
            y:
              ((e.pageY - imgPosition.y - window.scrollY) /
                imgPosition.height) *
              100,
          });
          setEndPoint({
            x:
              ((e.pageX - imgPosition.x - window.scrollX) / imgPosition.width) *
              100,
            y:
              ((e.pageY - imgPosition.y - window.scrollY) /
                imgPosition.height) *
              100,
          });
          setIsSelecting(true);
        }}
        onMouseMove={(e) => {
          if (!imgPosition || !isSelecting) return;
          console.log("setting cursor");

          setEndPoint({
            x:
              ((e.pageX - imgPosition.x - window.scrollX) / imgPosition.width) *
              100,
            y:
              ((e.pageY - imgPosition.y - window.scrollY) /
                imgPosition.height) *
              100,
          });
        }}
        className={styles.image}
        draggable={false}
        src={`data:image/png;base64,${img}`}
        ref={imgRef}
      />
    </div>
  );
};

export default ImageSpace;
