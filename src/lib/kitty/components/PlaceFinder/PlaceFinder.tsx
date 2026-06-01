import {
  marginsT,
  placeFinder,
  positionType,
} from "../../components/PlaceFinder/finder";
import {
  CSSProperties,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

type props = {
  targetEl?: DOMRect;
  position?: positionType;
  margins?: marginsT;
  disablePositioning?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const PlaceFinder = ({
  targetEl,
  margins,
  position,
  disablePositioning,
  ...elementProps
}: props) => {
  const [menuPosition, setMenuPosition] = useState<CSSProperties | undefined>({
    visibility: disablePositioning ? undefined : "hidden",
  });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (disablePositioning || !targetEl || !ref.current) return;

    setMenuPosition(
      placeFinder(
        targetEl,
        ref.current.getBoundingClientRect(),
        undefined,
        position,
        margins
      )
    );
  }, [disablePositioning, position, targetEl, margins]);

  return <div ref={ref} style={menuPosition} {...elementProps} />;
};
