import type { BaseSyntheticEvent } from "react";
import {
  type BaseLocationHook,
  Link as L2,
  type LinkProps,
  useLocation,
} from "wouter";
import type { BrowserLocationHook } from "wouter/use-browser-location";

export const Link = <T extends BaseLocationHook = BrowserLocationHook>(
  // @ts-expect-error unknown fields
  { to, href, children, onClick, asChild }: LinkProps<T>,
) => {
  const [, setLocation] = useLocation();
  return (
    <L2
      to={to}
      asChild={asChild}
      href={href}
      onClick={
        onClick ??
        ((event: BaseSyntheticEvent) => {
          event.preventDefault();
          setLocation(to ?? href);
        })
      }
    >
      {children}
    </L2>
  );
};
