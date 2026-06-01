import classNames from "classnames";
import {
  cloneElement,
  CSSProperties,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  useId,
} from "react";
import { colorOptions } from "../../providers/theme/types";
import "./badge.scss";

type props = {
  show?: boolean;
  display?: "number" | "dot" | ReactNode;
  value: ReactNode;
  maxValue?: number;
  children: ReactElement<{
    style?: CSSProperties;
  }>;
  color?: colorOptions;
};

export const Badge = ({
  children,
  show = true,
  // display = "number",
  value,
  maxValue = 999,
  color = colorOptions.error,
}: props) => {
  const id = useId();

  // NEW METHOD
  if (!isValidElement(children)) return children;
  if (children.type === Fragment) {
    console.warn(
      "Tooltip: Fragment not supported. Wrap in <span> or <div> instead.",
    );
    return children;
  }

  return (
    <>
      {cloneElement(children, {
        style: {
          ...children.props.style,
          anchorName: "--badge-" + id,
        },
      })}
      {show ? (
        <div
          className={classNames(
            "badge",
            typeof value === "object" && "badge-simple",
            color === colorOptions.primary && "element--primary",
            color === colorOptions.secondary && "element--secondary",
            color === colorOptions.success && "element--success",
            color === colorOptions.error && "element--error",
            color === colorOptions.warning && "element--warning",
            color === colorOptions.tertiary && "element--tertiary",
            color === colorOptions.surface && "element--surface",
          )}
          style={{
            positionAnchor: "--badge-" + id,
          }}
        >
          {typeof value === "number"
            ? value <= maxValue
              ? value
              : `+${maxValue}`
            : typeof value === "object"
              ? value
              : undefined}
        </div>
      ) : undefined}
    </>
  );

  // OLD METHOD
  // return (
  //   <div
  //     className="badge-wrapper"
  //     style={{
  //       "--badge": "--badge-" + id,
  //     }}
  //   >
  //     {children}
  //     {show ? (
  //       <div
  //         className={classNames(
  //           "badge",
  //           color === colorOptions.primary && "element--primary",
  //           color === colorOptions.secondary && "element--secondary",
  //           color === colorOptions.success && "element--success",
  //           color === colorOptions.error && "element--error",
  //           color === colorOptions.warning && "element--warning",
  //           color === colorOptions.tertiary && "element--tertiary",
  //           color === colorOptions.surface && "element--surface",
  //         )}
  //       >
  //         {typeof value === "number"
  //           ? value <= maxValue
  //             ? value
  //             : `+${maxValue}`
  //           : typeof value === "object"
  //             ? value
  //             : undefined}
  //       </div>
  //     ) : undefined}
  //   </div>
  // );
  // if (!show)
  //     return <>{children}</>
  // else {
  //     if (display === "dot")
  //         return (
  //             <div className="badge-wrapper">
  //                 {children}
  //                 <div className="badge"/>
  //             </div>
  //         )
  //     else return (
  //         <div className="badge-wrapper">
  //             {children}
  //             <div className="badge">
  //                 {value <= maxValue ? value : `${maxValue}+`}
  //             </div>
  //         </div>
  //     )
  // }
};
