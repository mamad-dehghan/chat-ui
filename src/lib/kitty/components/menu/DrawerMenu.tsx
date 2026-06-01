import { CaretRightIcon, Icon } from "@phosphor-icons/react";
import classNames from "classnames";
import React, { MouseEventHandler, ReactNode, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useDeferredState } from "../../hooks/useDeferredState";
import { AppLayer } from "../../providers/appLayer/appLayer";
import { Divider } from "../divider/Divider";
import { marginsT, positionType } from "../PlaceFinder/finder";
import { PlaceFinder } from "../PlaceFinder/PlaceFinder";
import "./menu.scss";
import { MenuItem } from "./menuItem";

type actionListItemType = {
  label: string;
  leadingIcon?: Icon;
  trailingIcon?: ReactNode;
  items?: never;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

type nestedListItemType = {
  label: string;
  leadingIcon?: Icon;
  trailingIcon?: ReactNode;
  items: list[];
  onClick?: never;
};

type list = actionListItemType | nestedListItemType | "separator";

const isActionCell = (item: list): item is actionListItemType => {
  return (
    typeof item !== "string" &&
    "onClick" in item &&
    typeof item.onClick === "function"
  );
};
const isSeparator = (item: list): item is "separator" => {
  return typeof item === "string";
};
// const isNestedCell = (item: list): item is nestedListItemType => {
//   return typeof item !== "string" && "subMenu" in item && Array.isArray(item.subMenu);
// };

type props = {
  hideLeadingIcon?: boolean; // TODO: add hide , show, auto
  className?: string;
  fitContent?: boolean;
  compact?: boolean;
  onClose: () => void;
  items: list[];
  targetEl?: DOMRect;
  isOpen: boolean;
  position?: positionType;
  margins?: marginsT;
  layerID: string;
};

// TODO: add hover open sub menu mode
// TODO: add grouping

export const DrawerMenu = React.memo(
  ({ isOpen, onClose, ...props }: Omit<props, "layerID">) => {
    const id = useId();

    const aa = useDeferredState(isOpen, isOpen ? 0 : 200);
    const targetEl2 = useDeferredState(
      props.targetEl,
      props.targetEl ? 0 : 200,
    );

    if ((!isOpen && !aa) || (!props.targetEl && !targetEl2)) return null;

    return createPortal(
      <AppLayer
        onClose={onClose}
        closeOnEscape
        blockBottomLayers
        onClick={onClose}
        className="menu-layer"
        id={id}
      >
        <MenuContent
          onClose={onClose}
          layerID={id}
          {...props}
          targetEl={props.targetEl ?? targetEl2}
        />
      </AppLayer>,
      document.getElementById("theme-provider")!,
      id,
    );
  },
  (a, b) => a.isOpen === b.isOpen,
);

const MenuContent = ({
  fitContent,
  items,
  hideLeadingIcon,
  className,
  compact,
  targetEl,
  onClose,
  position,
  margins,
  layerID,
}: Omit<props, "isOpen">) => {
  const [openSection, setOpenSection] = useState<string | undefined>(undefined);

  return (
    <PlaceFinder
      disablePositioning={window.innerWidth <= 480}
      targetEl={targetEl}
      position={position}
      margins={margins}
      className={classNames(
        // TODO: add scroller styles
        "menu scroller",
        fitContent && "fit-content",
        compact && "compact",
        hideLeadingIcon && "hide-leading-icons",
        className,
      )}
      onClick={(event) => {
        console.log(2);
        if ((event.target as HTMLElement)?.classList.contains("menu")) {
          event.stopPropagation();
        }
        // onClose();
      }}
    >
      {items.map((item, index) => {
        if (isSeparator(item))
          return <Divider key={"divider" + index} type="fullWidth" />;
        else if (isActionCell(item))
          return (
            <MenuItem
              key={item.label}
              title={item.label}
              onClick={item.onClick}
              TrailingIcon={item.trailingIcon}
              LeadingIcon={item.leadingIcon}
            />
          );
        else
          return (
            <NestedMenuItem
              isOpen={item.label === openSection}
              key={item.label}
              item={item}
              compact={compact}
              fitContent={fitContent}
              hideLeadingIcon={hideLeadingIcon}
              className={className}
              toggleOpen={() => {
                // event.stopPropagation();
                console.log(1);
                setOpenSection((openSection) =>
                  openSection === item.label ? undefined : item.label,
                );
              }}
              onClose={onClose}
              layerID={layerID}
            />
          );
      })}
    </PlaceFinder>
  );
};

type nestedMenuItemType = {
  item: nestedListItemType;
  hideLeadingIcon?: boolean;
  className?: string;
  fitContent?: boolean;
  compact?: boolean;
  isOpen: boolean;
  toggleOpen: () => void;
  onClose: () => void;
  layerID: string;
};
const NestedMenuItem = React.memo(
  ({
    item,
    isOpen,
    toggleOpen,
    onClose,
    className,
    compact,
    fitContent,
    hideLeadingIcon,
    layerID,
  }: nestedMenuItemType) => {
    const [targetEl, setTargetEl] = useState<DOMRect | undefined>(undefined);
    return (
      <>
        <MenuItem
          className={isOpen ? "element-focused" : undefined}
          key={item.label}
          LeadingIcon={item.leadingIcon}
          title={item.label}
          TrailingIcon={<CaretRightIcon weight={"fill"} />}
          onClick={(event) => {
            event.stopPropagation();
            setTargetEl(event.currentTarget.getBoundingClientRect());
            toggleOpen();
          }}
        />

        {targetEl && isOpen ? (
          createPortal(
            <MenuContent
              items={item.items}
              targetEl={targetEl}
              position={[
                { vertical: "bottom", horizontal: "right" },
                { vertical: "top", horizontal: "right" },
                { vertical: "bottom", horizontal: "left" },
                { vertical: "top", horizontal: "left" },
              ]}
              margins={{
                targetEl: { X: 0, Y: -8 - targetEl.height },
                container: { X: 4, Y: 4 },
              }}
              onClose={onClose}
              hideLeadingIcon={hideLeadingIcon}
              className={className}
              fitContent={fitContent}
              compact={compact}
              layerID={layerID}
            />,
            document.getElementById(layerID)!,
          )
        ) : (
          <></>
        )}
      </>
    );
  },
);
