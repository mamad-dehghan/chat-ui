// import { useState, useEffect } from "react";

// const BreakpointsMinWidth = {
//   mobile: 0,
//   tablet: 768,
//   desktop: 1280,
// };

// type Breakpoint = keyof typeof BreakpointsMinWidth;

// export const useBreakpointCapability = () => {
//   const [currentBreakpoint, setCurrentBreakpoint] =
//     useState<Breakpoint>("mobile");
//   useEffect(() => {});
// };

// const useBreakpoint = (breakpoint: Breakpoint) => {
//   const [isActive, setIsActive] = useState(defaultBreakpoint);
//   return window.matchMedia(`(min-width: ${minWidth}px)`).addEventListener;

//   //   useEffect(() => {
//   //     const mediaQueries = Object.keys(BreakpointsMinWidth).map((breakpointName) => {
//   //       const minWidth = BREAKPOINTS[breakpointName as Breakpoint];
//   //       return window.matchMedia(`(min-width: ${minWidth}px)`);
//   //     });

//   //     const handleMediaQueryChange = (mediaQuery: MediaQueryList) => {
//   //       if (mediaQuery.matches) {
//   //         const breakpointName = Object.keys(breakpoints).find(
//   //           (key) =>
//   //             breakpoints[key] ===
//   //             mediaQuery.media.match(
//   //               /min-width:\s*(\d+)px/.exec(mediaQuery.media)[1]
//   //             )
//   //         );
//   //         if (breakpointName) {
//   //           setCurrentBreakpoint(breakpointName);
//   //         }
//   //       }
//   //     };

//   //     mediaQueries.forEach((mediaQuery) => {
//   //       handleMediaQueryChange(mediaQuery);
//   //       mediaQuery.addEventListener("change", handleMediaQueryChange);
//   //     });

//   //     return () => {
//   //       mediaQueries.forEach((mediaQuery) => {
//   //         mediaQuery.removeEventListener("change", handleMediaQueryChange);
//   //       });
//   //     };
//   //   }, []);

//   //   return currentBreakpoint;
// };
