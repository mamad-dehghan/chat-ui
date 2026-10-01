import { DotsThreeVerticalIcon, XIcon } from "@phosphor-icons/react";
import {
  colorOptions,
  fillOptions,
  IconButton,
  sizeOptions,
  Tooltip,
} from "kitty";
import { useEffect } from "react";
import { useHeader } from "../../../layout/header";
import { useSelectModeStore } from "./state";

export const SelectModeHeader = () => {
  const selecteCount = useSelectModeStore((state) => state.selected.size);
  const cleanup = useSelectModeStore((state) => state.cleanup);
  const setup = useHeader((state) => state.setup);

  useEffect(() => {
    setup({
      left: (
        <Tooltip title="Cancel Selection">
          <IconButton
            onClick={cleanup}
            Icon={XIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
      ),
      center: <span>{selecteCount} selected</span>,
      right: (
        <Tooltip title="Actions">
          <IconButton
            Icon={DotsThreeVerticalIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
      ),
    });
  }, [selecteCount]);

  return undefined;
};
