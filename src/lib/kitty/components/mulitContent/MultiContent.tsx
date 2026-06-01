import classNames from "classnames";
import {
  HTMLAttributes,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./multiContent.scss";

type props<T, P extends Record<string, unknown>> = {
  modes: { activeOn: T; Component: (p: P) => ReactNode }[];
  currentMode: T;
  componentProps: P;
  wrapperProps?: Omit<HTMLAttributes<HTMLSpanElement>, "chilldren">;
  direction: "horizontal" | "vertical";
};

export const MultiContent = <T, P extends Record<string, unknown>>({
  modes,
  currentMode,
  componentProps,
  wrapperProps,
  direction,
}: props<T, P>) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const activeIndex = Math.max(
      modes.findIndex((mode) => mode.activeOn === currentMode),
      0,
    );
    ref.current?.scroll(
      direction === "horizontal"
        ? { left: ref.current.clientWidth * activeIndex, behavior: "smooth" }
        : { top: ref.current.clientHeight * activeIndex, behavior: "smooth" },
    );
  }, [ref, currentMode]);

  return (
    <span
      ref={ref}
      className={classNames("multi-content", direction)}
      {...wrapperProps}
    >
      {modes.map((item, index) => (
        <item.Component key={index} {...componentProps} />
      ))}
    </span>
  );
};

export const MultiContentNumber = ({
  direction,
  currentMode,
  wrapperProps,
  componentProps,
}: Omit<
  props<number, Omit<HTMLAttributes<HTMLSpanElement>, "chilldren">>,
  "modes"
>) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [modes, setModes] = useState([-Infinity, currentMode, Infinity]);
  useLayoutEffect(() => {
    if (modes[0] !== -Infinity) {
      ref.current?.scroll(
        direction === "horizontal"
          ? { left: 0, behavior: "smooth" }
          : { top: 0, behavior: "smooth" },
      );
      setTimeout(() => {
        setModes((pre) => [-Infinity, pre[0], Infinity]);
      }, 400);
    } else if (modes[2] !== Infinity) {
      ref.current?.scroll(
        direction === "horizontal"
          ? { left: ref.current.clientWidth * 2, behavior: "smooth" }
          : { top: ref.current.clientHeight * 2, behavior: "smooth" },
      );
      setTimeout(() => {
        setModes((pre) => [-Infinity, pre[2], Infinity]);
      }, 400);
    } else {
      ref.current?.scroll(
        direction === "horizontal"
          ? { left: ref.current.clientWidth, behavior: "instant" }
          : { top: ref.current.clientHeight, behavior: "instant" },
      );
    }
  }, [ref, modes]);

  useEffect(() => {
    setModes((pre) =>
      pre[1] === currentMode
        ? pre
        : pre[1] > currentMode
          ? [currentMode, pre[1], Infinity]
          : [-Infinity, pre[1], currentMode],
    );
  }, [currentMode]);

  return (
    <span
      ref={ref}
      className={classNames("multi-content", "number", direction)}
      {...wrapperProps}
    >
      <span key={"before"} {...componentProps}>
        {modes[0]}
      </span>
      <span key={"current"} {...componentProps}>
        {modes[1]}
      </span>
      <span key={"after"} {...componentProps}>
        {modes[2]}
      </span>
    </span>
  );
};
