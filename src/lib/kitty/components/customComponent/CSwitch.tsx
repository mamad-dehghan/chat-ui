import { useState } from "react";
import { Switch } from "../../components/input/Switch";
import { colorOptions } from "../../providers/theme/types";

export const CSwitch = () => {
  const [active, setActive] = useState<boolean>(false);
  return (
    <Switch
      onClick={() => setActive((pre) => !pre)}
      checked={active}
      hasCheckedIcon={true}
      checkedColor={colorOptions.primary}
    />
  );
};
