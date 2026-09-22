import {
  type DetailedHTMLProps,
  type ImgHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import { create } from "zustand";
import "./zoomable.scss";

type props = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  | "draggable"
  | "onPointerDown"
  | "onPointerMove"
  | "onPointerUp"
  | "onPointerCancel"
>;

type Position = {
  x: number;
  y: number;
};

const SCALE_THRESHOLD = 5;

const distance = (a: Position, b: Position) => Math.hypot(a.x - b.x, a.y - b.y);

const center = (a: Position, b: Position): Position => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

// const overScrollCalculator = (imageRef: HTMLDivElement | null) => {
//   if (!imageRef) return false;
//   // console.log("trigger")
//   const left = Math.floor(imageRef.scrollLeft);
//   const right = imageRef.scrollWidth - (left + imageRef.clientWidth)
//   if (left === 0 || right === 0) return false;
//   else return true
// }

const clamp = (min: number, value: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

type zoomableStore = {
  zoom: HTMLElement | null;
  img: HTMLElement | null;
  setRef: (ref: zoomableStore["zoom"]) => void;
  pointers: Map<number, Position>;
  scale: number;
  translateX: number;
  translateY: number;
  thresholdX: number;
  thresholdY: number;
  fixPosition: () => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onDoubleClick: () => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
};

const useZoomable = create<zoomableStore>((set, get) => ({
  zoom: null,
  img: null,
  setRef: (zoom) => {
    if (!zoom) return;
    const img = zoom?.firstChild as HTMLElement | null;
    if (!img) return;

    const thresholdX = Math.max((img.clientWidth - zoom.clientWidth) / 2, 0);
    const thresholdY = Math.max((img.clientHeight - zoom.clientHeight) / 2, 0);

    set({
      zoom,
      img,
      thresholdX,
      thresholdY,
      translateX: 0,
      translateY: 0,
      scale: 1,
      pointers: new Map(),
    });
  },
  pointers: new Map(),
  scale: 1,
  translateX: 0,
  translateY: 0,
  thresholdX: 0,
  thresholdY: 0,
  fixPosition: () => {
    set((prev) => {
      if (!prev.zoom || !prev.img) return {};

      const thresholdScale = clamp(1, prev.scale, SCALE_THRESHOLD);
      const thresholdX = Math.max(
        (prev.img.clientWidth * thresholdScale - prev.zoom.clientWidth) / 2,
        0,
      );
      const thresholdY = Math.max(
        (prev.img.clientHeight * thresholdScale - prev.zoom.clientHeight) / 2,
        0,
      );

      return {
        thresholdX,
        thresholdY,
        translateX: clamp(-thresholdX, prev.translateX, thresholdX),
        translateY: clamp(-thresholdY, prev.translateY, thresholdY),
        scale: thresholdScale,
      };
    });
  },
  onTouchMove: (event) => {
    const touches = event.touches;
    const pointers = get().pointers;

    if (pointers.size === 1) {
      for (let i = 0; i < touches.length; i++) {
        const touch = touches.item(i);
        if (!touch) continue;
        const identifier = touch.identifier;
        const lastPosition = pointers.get(identifier);
        if (!lastPosition) {
          console.log("new");
          // pointers.set(identifier, {
          //   x: touch.screenX,
          //   y: touch.screenY,
          // })
          continue;
        } else {
          set((prev) =>
            prev.scale === 1
              ? {}
              : {
                  translateX: prev.translateX + touch.screenX - lastPosition.x,
                  translateY: prev.translateY + touch.screenY - lastPosition.y,
                },
          );
          get().pointers.set(identifier, {
            x: touch.screenX,
            y: touch.screenY,
          });
        }
      }
    } else if (pointers.size === 2) {
      const before: Position[] = [];
      const after: Position[] = [];
      for (let i = 0; i < touches.length; i++) {
        const touch = touches.item(i);
        if (!touch) {
          console.log("not exist touch");
          continue;
        }
        const identifier = touch.identifier;
        const lastPosition = pointers.get(identifier);
        if (!lastPosition) {
          console.log("out of count");
          continue;
          // new touch
        } else {
          before.push(lastPosition);
          after.push({
            x: touch.screenX,
            y: touch.screenY,
          });
          get().pointers.set(identifier, {
            x: touch.screenX,
            y: touch.screenY,
          });
        }
      }
      if (before.length === 2 && after.length === 2) {
        const startDistance = distance(...before);
        const endDistance = distance(...after);
        const startCenter = center(...before);
        const endCenter = center(...after);

        set((prev) => ({
          x: prev.translateX + endCenter.x - startCenter.x,
          y: prev.translateY + endCenter.y - endCenter.y,
          scale: (prev.scale * endDistance) / startDistance,
        }));
      } else {
        console.log(before, after);
      }
    }
  },
  onDoubleClick: () => {
    set((prev) => {
      const newScale = prev.scale > 2 ? 1 : prev.scale * 2.6;
      return { scale: newScale };
    });
    get().fixPosition();
  },
  onTouchStart: (event) => {
    for (let i = 0; i < event.changedTouches.length; i++) {
      get().pointers.set(event.changedTouches.item(i).identifier, {
        x: event.changedTouches.item(i).screenX,
        y: event.changedTouches.item(i).screenY,
      });
    }
  },
  onTouchEnd: (event) => {
    // calc(e.touches)
    for (let i = 0; i < event.changedTouches.length; i++) {
      get().pointers.delete(event.changedTouches.item(i).identifier);
    }
    if (get().pointers.size === 0) {
      get().fixPosition();
    }
  },
}));

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
