import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Header } from "../../components/header";
import { IconButton, Input, Tooltip } from "../../lib/kitty/components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../../lib/kitty/providers/theme/types";
import { useState } from "react";

type props = {
  handlePrevious: () => void;
  handleNext: (groupName: string) => void;
};

export const AskInfo = ({ handlePrevious, handleNext }: props) => {
  const [name, setName] = useState<string>("");
  return (
    <>
      <Header>
        <Tooltip title="Back">
          <IconButton
            onClick={() => {
              document.startViewTransition(() => {
                handlePrevious();
              });
            }}
            Icon={CaretLeftIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
        <span></span>
        <Tooltip title="Next">
          <IconButton
            onClick={() => {
              document.startViewTransition(() => {
                handleNext(name);
              });
            }}
            Icon={CaretRightIcon}
            size={sizeOptions.medium}
            fill={fillOptions.link}
            mode={colorOptions.tertiary}
          />
        </Tooltip>
      </Header>
      <div>
        <Input
          id="group-name"
          mode={colorOptions.primary}
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </>
  );
};
