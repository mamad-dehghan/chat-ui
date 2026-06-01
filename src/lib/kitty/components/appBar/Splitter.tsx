import classNames from "classnames";
import {
  MouseEvent,
  ReactElement,
  TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./splitter.scss";

type splitterPanelType = {
  Element: ReactElement;
  grow?: number;
  minSize?: `${number}px`;
  hideable?: boolean;
};

type props = {
  panels: readonly splitterPanelType[];
  layout: "horizontal" | "vertical";
  // TODO: add a key for storing last mode
};
// TODO: improve touch device experience
const calcPanelWidth = (
  predictedSize: number,
  minSize: number,
  hideable: boolean,
) => {
  return hideable && predictedSize < (minSize * 2) / 3
    ? 0
    : Math.max(predictedSize, minSize);
};

const calcW = (el: [number, number], panels: readonly splitterPanelType[]) => {
  const mins = [
    +(panels[0].minSize ?? "0px").slice(0, -2),
    +(panels[1].minSize ?? "0px").slice(0, -2),
  ];

  let w1 = calcPanelWidth(el[0], mins[0], panels[0].hideable ?? false);
  const w2 = calcPanelWidth(
    el[1] + el[0] - w1,
    mins[1],
    panels[1].hideable ?? false,
  );
  if (w2 !== el[1] + el[0] - w1)
    w1 = calcPanelWidth(
      el[0] + el[1] - w2,
      mins[0],
      panels[0].hideable ?? false,
    );
  return [w1, w2];
};

export const Splitter = ({ panels, layout }: props) => {
  const [ol, setOl] = useState<
    | {
        pointer: undefined;
        [0]: undefined;
        [1]: undefined;
      }
    | {
        pointer: number;
        [0]: number;
        [1]: number;
      }
  >({
    pointer: undefined,
    [0]: undefined,
    [1]: undefined,
  });
  const firstChildRef = useRef<HTMLDivElement>(null);
  const lastChildRef = useRef<HTMLDivElement>(null);

  const over = useCallback(
    (positions: { pageX: number; pageY: number }) => {
      setOl((pre) => {
        if (!pre.pointer) return pre;
        const distance =
          (layout === "horizontal" ? positions.pageX : positions.pageY) -
          pre.pointer;

        return {
          pointer: layout === "horizontal" ? positions.pageX : positions.pageY,
          [0]: pre[0] + distance,
          [1]: pre[1] - distance,
        };
      });
    },
    [layout],
  );

  const onTouchOver = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      over(e.changedTouches[0]);
    },
    [over],
  );

  const onMouseOver = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      over(e);
    },
    [over],
  );

  const end = useCallback(() => {
    setTimeout(() => {
      setOl({
        pointer: undefined,
        [0]: undefined,
        [1]: undefined,
      });
    }, 10);
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      // if (typeof e?.relatedTarget?.document === "undefined") {
      over(e.changedTouches[0]);
      end();
      // }
    },
    [over, end],
  );

  const onMouseEnd = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      // if (typeof e?.relatedTarget?.document === "undefined") {
      over(e);
      end();
      // }
    },
    [over, end],
  );

  const onStart = useCallback(
    (positions: { pageX: number; pageY: number }) => {
      if (firstChildRef.current && lastChildRef.current)
        setOl(
          layout === "horizontal"
            ? {
                pointer: positions.pageX,
                [0]: firstChildRef.current.clientWidth,
                [1]: lastChildRef.current.clientWidth,
              }
            : {
                pointer: positions.pageY,
                [0]: firstChildRef.current.clientHeight,
                [1]: lastChildRef.current.clientHeight,
              },
        );
    },
    [layout, firstChildRef, lastChildRef],
  );

  const onMouseStart = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      onStart(e);
    },
    [onStart],
  );

  const onTouchStart = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      onStart(e.changedTouches[0]);
    },
    [onStart],
  );

  useEffect(() => {
    if (ol.pointer) {
      const [w1, w2] = calcW([ol[0], ol[1]], panels);
      firstChildRef.current?.setAttribute(
        "style",
        `flex-basis:clamp(0px, ${w1}px, 100%)`,
      );
      lastChildRef.current?.setAttribute(
        "style",
        `flex-basis:clamp(0px, ${w2}px, 100%)`,
      );
    }
  }, [ol, panels, firstChildRef, lastChildRef, layout]);

  return (
    <div
      className={classNames("splitter", layout, ol.pointer && "resize")}
      onMouseMove={onMouseOver}
      onMouseUp={onMouseEnd}
      onMouseLeave={onMouseEnd}
      // onDragOver={onMouseOver}
      // onDragEnd={onMouseEnd}
      // onDragLeave={onMouseEnd}
      onTouchMove={onTouchOver}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div
        key="first"
        className={classNames("splitter-panel-wrapper")}
        ref={firstChildRef}
      >
        {panels[0].Element}
      </div>
      <div
        className="splitter-tumb"
        onMouseDown={onMouseStart}
        onTouchStart={onTouchStart}
        // draggable={false}
        // onDragStart={onMouseStart}
      >
        <button className="splitter-divider"></button>
      </div>
      <div
        key="second"
        className={classNames("splitter-panel-wrapper")}
        ref={lastChildRef}
      >
        {panels[1].Element}
      </div>
      {/*{panels.map((panel, index) => (
        <div key={index} className={classNames("splitter-panel-wrapper")}>
          {panel.Element}
        </div>
      ))}*/}
    </div>
  );
};
