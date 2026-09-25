import { CaretLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import {
  IconButton,
  Tooltip,
  colorOptions,
  fillOptions,
  sizeOptions,
} from "kitty";
import type { ComponentProps } from "react";
import { useLocation } from "wouter";

type props = Partial<ComponentProps<typeof IconButton>>;

export const HeaderBackButton = (props: props) => {
  const [, setLocation] = useLocation();
  return (
    <Tooltip title="Back">
      <IconButton
        onClick={() => {
          document.startViewTransition(() => {
            setLocation("/");
          });
        }}
        Icon={CaretLeftIcon}
        size={sizeOptions.medium}
        fill={fillOptions.link}
        mode={colorOptions.tertiary}
        {...props}
      />
    </Tooltip>
  );
};

export const HeaderSearchButton = (props: props) => {
  return (
    <Tooltip title="Search">
      <IconButton
        Icon={MagnifyingGlassIcon}
        size={sizeOptions.medium}
        fill={fillOptions.link}
        mode={colorOptions.tertiary}
        {...props}
      />
    </Tooltip>
  );
};
