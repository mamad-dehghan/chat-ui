import { X } from "@phosphor-icons/react";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  KeyboardEvent,
} from "react";
import { fillOptions } from "../../providers/theme/types";
import { FilterChip } from "../button/Chip";
import { IInputProps, Input } from "./Input";

type multiItemInputProps = Omit<
  IInputProps,
  "onKeyDown" | "onChange" | "value"
> & {
  onChange: (value: string) => void;
  value: string;
};

export const MultiItemInput = ({
  onChange,
  value,
  ...others
}: multiItemInputProps) => {
  // const [inputValue, setInputValue] = useState<string>(value)

  useEffect(() => {
    onChange(value);
  }, [value]);

  const tags = useMemo<string[]>(
    () =>
      value
        .split(/(,|\s)/)
        .slice(0, -1)
        .filter((str) => Boolean(str) && str !== "," && str !== " "),
    [value]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const i: string = [...tags, e.target.value].join(",").replace(" ", ",");
      onChange(i);
    },
    [tags]
  );

  // useEffect(() => {
  //     onChange(inputValue)
  // }, [onChange, inputValue]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      // @ts-ignore
      if (e.target.value === "" && e.code === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        const i: string = tags.join(",");
        onChange(i);
      }
    },
    [tags]
  );

  const inputVal = useMemo<string>(
    () => value.split(/(,|\s)/).slice(-1)[0],
    [value]
  );

  const onTagClick = useCallback(
    (tagContent: string) => {
      onChange(`,${value},`.replace(`,${tagContent},`, ",").slice(1, -1));
    },
    [value]
  );

  return (
    <div className="tags-input">
      <Input
        style={{
          paddingInlineStart: `calc(calc(20px + ${tags.join("").length}ch) + ${
            3.375 * tags.length - (tags.length ? 1 : 0)
          }rem)`,
        }}
        value={inputVal}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        supportText="Use 'Space' or ',' for separating tags"
        {...others}
      />
      <div className="tags-wrapper">
        {tags.map((tag, index) => (
          <FilterChip
            key={tag + index}
            Icon={X}
            enable={true}
            onClick={() => onTagClick(tag)}
            fill={fillOptions.outline}
          >
            {tag}
          </FilterChip>
        ))}
      </div>
    </div>
  );
};
