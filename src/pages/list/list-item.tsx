import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";
import { TickBadge } from "../group/check_tick";
import "./list_item.scss";

type props = {
  avatar: ReactNode;
  // avatarTitle: string;
  title: string;
  description?: string;
  selected?: boolean;
} & Omit<ComponentProps<"div">, "title" | "children">;

export const ListItem = ({
  avatar,
  title,
  description,
  className,
  selected = false,
  ...others
}: props) => {
  return (
    <div className={classNames("list-item", className)} {...others}>
      <TickBadge show={selected}>
        <div className="list-item-avatar">
          <div className="avatar-content">{avatar}</div>
          <div className="avatar-empty">{title.charAt(0)}</div>
        </div>
      </TickBadge>
      <div className="list-item-content">
        <div className="list-item-title">{title}</div>
        <div className="list-item-description">{description}</div>
      </div>
    </div>
  );
};
