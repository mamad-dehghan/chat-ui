import {
  type DetailedHTMLProps,
  type ImgHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import { useZoomable } from "./state";
import "./index.scss";

type props = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  | "draggable"
  | "onPointerDown"
  | "onPointerMove"
  | "onPointerUp"
  | "onPointerCancel"
>;

// const overScrollCalculator = (imageRef: HTMLDivElement | null) => {
//   if (!imageRef) return false;
//   // console.log("trigger")
//   const left = Math.floor(imageRef.scrollLeft);
//   const right = imageRef.scrollWidth - (left + imageRef.clientWidth)
//   if (left === 0 || right === 0) return false;
//   else return true
// }

export const Zoomable = ({ ...props }: props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const translateX = useZoomable((state) => state.translateX);
  const translateY = useZoomable((state) => state.translateY);
  const onTouchEnd = useZoomable((state) => state.onTouchEnd);
  const onTouchStart = useZoomable((state) => state.onTouchStart);
  const onTouchMove = useZoomable((state) => state.onTouchMove);
  const onDoubleClick = useZoomable((state) => state.onDoubleClick);
  const scale = useZoomable((state) => state.scale);
  const setRef = useZoomable((state) => state.setRef);

  useEffect(() => {
    setRef(wrapperRef.current);
  }, [wrapperRef]);

  // useEffect(() => {
  //   return () => {
  //     useZoomable.setState({
  //       zoom: null,
  //       img: null,
  //       pointers: new Map(),
  //       scale: 1,
  //       translateX: 0,
  //       translateY: 0,
  //       thresholdX: 0,
  //       thresholdY: 0,
  //     })
  //   }
  // })

  return (
    <div
      className="zoomable"
      style={{
        overscrollBehavior: scale !== 1 ? "contain" : "auto",
      }}
      ref={wrapperRef}
    >
      <img
        {...props}
        draggable={false}
        onTouchStart={onTouchStart}
        onDoubleClick={onDoubleClick}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          display: "block",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          userSelect: "none",
          margin: "auto",
          transition: `transform 80ms`,
          ...props.style,
          transform: `
            ${props.style?.transform || ""}
            matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})
          `,
        }}
      />
    </div>
  );
};
