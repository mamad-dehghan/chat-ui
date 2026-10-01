export type zoomableStore = {
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

export type Position = {
  x: number;
  y: number;
};
