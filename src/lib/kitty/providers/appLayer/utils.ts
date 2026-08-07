// export function blurBottomLayers() {
//   if (document.querySelector(".theme-provider > .block-bottom-layers")) {
//     document
//       .querySelectorAll(
//         ".theme-provider > *:not(.prevent-block-layer, :last-child)",
//       )
//       .forEach((element) => {
//         element.setAttribute("inert", "true");
//       });
//     const lastElement = document.querySelector<HTMLButtonElement>(
//       ".theme-provider > .block-bottom-layers:last-child",
//     );

//     lastElement?.removeAttribute("inert");
//     lastElement?.focus();
//   } else {
//     document.querySelectorAll(".theme-provider > *").forEach((element) => {
//       element.removeAttribute("inert");
//     });
//   }
// }

// export function getActiveLayer() {
//   const lastElement = document.querySelector<HTMLButtonElement>(
//     ".theme-provider > .block-bottom-layers:last-child",
//   );
//   return lastElement;
// }

const HARD_LAYERS = ".theme-provider > [data-layer=true].block-bottom-layers";
const LAYERS = ".theme-provider > *";
const BLOCKABLE_LAYERS =
  ".theme-provider > [data-layer=true]:not(.prevent-block-layer)";
// const VISIBLE_LAYERS =
//   ".theme-provider > [data-layer=true].prevent-block-layer";
const MAIN_LAYERS = ".theme-provider > :not([data-layer=true])";

export function blurBottomLayers() {
  if (document.querySelector(HARD_LAYERS)) {
    const mainLayers = Array.from(document.querySelectorAll(MAIN_LAYERS));
    const elements = Array.from(document.querySelectorAll(BLOCKABLE_LAYERS));
    const activeLayer = elements.pop() as HTMLElement | undefined;

    mainLayers.forEach((element) => {
      element.setAttribute("inert", "true");
    });
    elements.forEach((element) => {
      element.setAttribute("inert", "true");
    });

    activeLayer?.removeAttribute("inert");
    activeLayer?.focus();
  } else {
    const elements = document.querySelectorAll(LAYERS);
    elements.forEach((element) => {
      element.removeAttribute("inert");
    });
  }
}

export function getActiveLayer() {
  const elements = Array.from(
    document.querySelectorAll<HTMLButtonElement>(HARD_LAYERS),
  );
  return elements.at(-1);
}
