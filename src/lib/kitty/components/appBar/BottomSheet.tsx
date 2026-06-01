// import classNames from "classnames";
// import { ReactNode, useEffect, useId, useState } from "react";
// import { createPortal } from "react-dom";
// import { useDeferredState } from "../../hooks/useDeferredState";
// import { AppLayer } from "../../providers/appLayer/appLayer";
// import "./bottomsheet.scss";

// type props = {
//   open: boolean;
//   onClose: () => void;
//   children: ReactNode;
// };

// export const BottomSheet = ({ open, onClose, children }: props) => {
//   const id = useId();
//   const delayedOpen = useDeferredState(open, 200);
//   const [startTouchPoint, setPoint] = useState<number | undefined>(undefined);
//   const [view, setView] = useState<any>(undefined);

//   useEffect(() => {
//     // if (open && delayedOpen) {
//     //   document
//     //     .querySelector("bottom-sheet")
//     //     ?.scrollIntoView({ block: "center" });
//     // }
//   }, [open, delayedOpen]);

//   if (!open && !delayedOpen) return undefined;

//   return createPortal(
//     <AppLayer
//       blockBottomLayers
//       closeOnEscape
//       onClose={onClose}
//       onClick={onClose}
//       className="bottom-sheet-layer"
//     >
//       <div
//         className={classNames("bottom-sheet-wrapper", {
//           open: open && delayedOpen,
//           opening: open && !delayedOpen,
//         })}
//         // onScrollEnd={({ currentTarget }) => {
//         //   if ((currentTarget as HTMLDivElement).scrollTop === 0) onClose();
//         // console.log([
//         //   // (currentTarget as HTMLDivElement).classList,
//         //   (currentTarget as HTMLDivElement).scrollHeight,
//         //   (currentTarget as HTMLDivElement).scrollTop,
//         //   (currentTarget as HTMLDivElement).getBoundingClientRect(),
//         // ]);
//         // }}
//         onScrollCapture={(event) => {
//           const { target, currentTarget } = event;

//           if (startTouchPoint === undefined)
//             return setPoint(currentTarget.scrollTop);

//           console.log({
//             startTouchPoint: startTouchPoint,
//             scrollTop: currentTarget.scrollTop,
//             clientTop: currentTarget.clientTop,
//             body: document.body.clientHeight,
//           });

//           if (
//             // currentTarget.scrollTop < startTouchPoint &&
//             currentTarget.scrollTop < document.body.clientHeight / 8 &&
//             startTouchPoint - currentTarget.clientTop >
//               document.body.clientHeight / 8
//           )
//             onClose();

//           // console.log(
//           //   (currentTarget as HTMLDivElement).scrollTop,
//           //   currentTarget.clientHeight / 8,
//           //   // (currentTarget as HTMLDivElement).scrollHeight,
//           //   // (currentTarget as HTMLDivElement).getBoundingClientRect().height,
//           //   // (currentTarget as HTMLDivElement).getBoundingClientRect().height / 4,
//           // );
//           // setView([
//           //   (currentTarget as HTMLDivElement).classList,
//           //   (currentTarget as HTMLDivElement).scrollHeight,
//           //   (currentTarget as HTMLDivElement).scrollTop,
//           //   (currentTarget as HTMLDivElement).getBoundingClientRect(),
//           // ]);
//         }}
//         onScrollEndCapture={() => {
//           setPoint(undefined);
//         }}
//         onTouchStartCapture={(event) => {
//           // console.log(event.changedTouches[0].pageY, 1);
//           // setPoint(event.changedTouches[0].pageY);
//         }}
//         onTouchMove={(event) => {
//           // console.log(event);
//         }}
//         onTouchEndCapture={(event) => {
//           console.log("now");
//           // console.log(
//           //   event.currentTarget.scrollTop,
//           //   event.changedTouches[0].pageY,
//           //   2,
//           // );
//           // if (
//           //   // also check inner scroll position
//           //   event.changedTouches[0].pageY > startTouchPoint &&
//           //   (event.currentTarget as HTMLDivElement).scrollTop <
//           //     (event.currentTarget as HTMLDivElement).getBoundingClientRect()
//           //       .height /
//           //       5
//           // )
//           //   onClose();
//         }}
//       >
//         <div className="toper-padding"></div>
//         <div className="toper-padding"></div>
//         <div className="top-padding"></div>
//         <div
//           className="bottom-sheet"
//           onClick={(event) => {
//             event.stopPropagation();
//           }}
//         >
//           <div className="bottom-sheet-tumb">
//             <button className="bottom-sheet-divider"></button>
//           </div>
//           <div className="bottom-sheet-content">
//             {JSON.stringify(view, null, 2)}
//             {children}
//           </div>
//         </div>
//       </div>
//     </AppLayer>,
//     document.getElementById("theme-provider")!,
//     id,
//   );
// };
