import { CaretRightIcon } from "@phosphor-icons/react";
import {
  colorOptions,
  fillOptions,
  IconButton,
  Input,
  sizeOptions,
  Tooltip,
} from "kitty";
import { useEffect, useState } from "react";
import { useHeader } from "../../layout/header";
import { HeaderBackButton } from "../../layout/header/commons";

type props = {
  handlePrevious: () => void;
  handleNext: (groupName: string) => void;
};

export const AskInfo = ({ handlePrevious, handleNext }: props) => {
  const [name, setName] = useState<string>("");
  const setup = useHeader((state) => state.setup);
  useEffect(() => {
    setup({
      left: (
        <HeaderBackButton
          onClick={() => {
            document.startViewTransition(() => {
              handlePrevious();
            });
          }}
        />
      ),
      center: null,
      right: (
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
      ),
    });
  }, []);

  return (
    <>
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
