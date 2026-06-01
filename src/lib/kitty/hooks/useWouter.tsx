import { useEffect, useState } from "react";
import { BaseLocationHook } from "wouter";
import { navigate as navigateW } from "wouter/use-browser-location";

export const useWouter: BaseLocationHook = () => {
  const [location, setLocation] = useState(window.location.pathname);

  const navigate = (
    to: string,
    options: {
      state?: Record<string, unknown>;
      replace?: boolean;
    } = {},
  ) => {
    // console.log("nav");
    setLocation(to);
    navigateW(to, {
      replace: options.replace,
      state: options.state,
    });
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    const handlePopState = () => {
      // console.log(event);
      // if (event.composed) return;
      // event.stopPropagation();
      // const activeLayer = getActiveLayer();

      // if (activeLayer && event.isTrusted && activeLayer.onclick) {
      //   event.stopImmediatePropagation();
      //   event.preventDefault();
      //   activeLayer.click();
      // } else {
      setLocation(window.location.pathname);
      // }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return [location, navigate];
};
