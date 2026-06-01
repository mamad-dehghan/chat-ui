type verticalOptions = "top" | "center" | "bottom";
type horizontalOptions = "left" | "center" | "right";

export type positionType = {
  vertical: verticalOptions;
  horizontal: horizontalOptions;
}[];

type marginObjectT = {
  X: number;
  Y: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type placeFinderOutputType = Partial<{
  left: number;
  right: number;
  top: number;
  bottom: number;
  transform: string;
}>;
// FIXME: when width is 100%, it's take minus inline value
// type margin
export type marginsT = Record<"container" | "targetEl", marginObjectT>;
export const placeFinder = (
  // out
  targetEl: DOMRect,
  // in
  currentEl: Pick<DOMRect, "height" | "width">,
  container: DOMRect = document.body.getBoundingClientRect(),
  position: positionType = [{ vertical: "top", horizontal: "center" }],
  margins: marginsT = {
    container: {
      X: 0,
      Y: 0,
    },
    targetEl: {
      X: 0,
      Y: 0,
    },
  }
): placeFinderOutputType => {
  const allMargins: Record<
    "container" | "targetEl",
    Required<marginObjectT>
  > = {
    container: {
      top: margins.container?.Y,
      bottom: margins.container?.Y,
      left: margins.container.X,
      right: margins.container.X,
      ...margins.container,
    },
    targetEl: {
      top: margins.targetEl?.Y,
      bottom: margins.targetEl?.Y,
      left: margins.targetEl.X,
      right: margins.targetEl.X,
      ...margins.targetEl,
    },
  };
  const hasTopSpace = () =>
    targetEl.top -
      allMargins.targetEl.top -
      (container.top + allMargins.container.top) >
    currentEl.height;

  const hasBottomSpace = () =>
    container.bottom -
      allMargins.container.bottom -
      (targetEl.bottom + allMargins.targetEl.bottom) >
    currentEl.height;

  const hasLeftSpace = () =>
    targetEl.left -
      allMargins.targetEl.left -
      (container.left + allMargins.container.left) >
    currentEl.width;

  const hasRightSpace = () =>
    container.right -
      allMargins.container.right -
      (targetEl.right + allMargins.targetEl.right) >
    currentEl.width;

  // const hasTopCenterSpace = () => (targetEl.top - allMargins.targetEl.top) - (container.top + allMargins.container.top) > currentEl.height / 2

  // const hasBottomCenterSpace = () => (container.bottom - allMargins.container.bottom) - (targetEl.bottom + allMargins.targetEl.bottom) > currentEl.height / 2

  // const hasLeftCenterSpace = () => (targetEl.left - allMargins.targetEl.left) - (container.left + allMargins.container.left) > currentEl.width / 2

  // const hasRightCenterSpace = () => (container.right - allMargins.container.right) - (targetEl.right + allMargins.targetEl.right) > currentEl.width / 2

  const getYTop = () =>
    Math.max(
      container.top + allMargins.container.top,
      Math.min(
        targetEl.top - allMargins.targetEl.top - currentEl.height,
        container.bottom - allMargins.container.bottom - currentEl.height
      )
    );

  const getYBottom = () =>
    Math.max(
      container.top + allMargins.container.top,
      Math.min(
        targetEl.bottom + allMargins.targetEl.bottom,
        container.bottom - allMargins.container.bottom - currentEl.height
      )
    );

  const getXLeft = () =>
    Math.max(
      container.left + allMargins.container.left,
      Math.min(
        targetEl.left - allMargins.targetEl.left - currentEl.width,
        container.right - allMargins.container.right - currentEl.width
      )
    );

  const getXRight = () =>
    Math.max(
      container.left + allMargins.container.left,
      Math.min(
        container.width - allMargins.container.right - currentEl.width,
        targetEl.right + allMargins.targetEl.right
      )
    );

  const getXCenter = () =>
    Math.max(
      container.left + allMargins.container.left,
      Math.min(
        targetEl.left + targetEl.width / 2 - currentEl.width / 2,
        container.right - currentEl.width - allMargins.container.right
      )
    );

  const getYCenter = () =>
    Math.max(
      container.top + allMargins.container.top,
      Math.min(
        targetEl.top + targetEl.height / 2 - currentEl.height / 2,
        container.bottom - allMargins.container.bottom - currentEl.height
      )
    );
  // merge all min and max for X and Y

  for (const positionKey in position) {
    const pos: placeFinderOutputType = {};
    switch (position[positionKey].vertical) {
      case "top":
        if (hasTopSpace())
          pos.bottom = Math.floor(
            container.height - (getYTop() + currentEl.height)
          );
        else continue;
        break;
      case "bottom":
        if (hasBottomSpace()) pos.top = Math.floor(getYBottom());
        else continue;
        break;
      case "center":
        // add if and check for availability
        pos.top = Math.floor(getYCenter());
      // - currentEl.height / 2
      // pos.transform = 'translate(0, 50%)'
    }
    switch (position[positionKey].horizontal) {
      case "left":
        if (hasLeftSpace())
          pos.right = Math.floor(
            container.width - (getXLeft() + currentEl.width)
          );
        else continue;
        break;
      case "right":
        if (hasRightSpace()) pos.left = Math.floor(getXRight());
        else continue;
        break;
      case "center":
        // if (hasLeftCenterSpace()){
        //     pos.right = container.width - (getXCenter() +currentEl.width/2)
        //     pos.transform = 'translate(50%, 0)'
        // }else {
        pos.left = Math.floor(getXCenter());
      // - currentEl.width / 2
      // pos.transform = 'translate(50%, 0)'
      // }
    }
    return pos;
  }

  const pos: placeFinderOutputType = {};

  switch (position[0].vertical) {
    case "top":
      pos.bottom = Math.floor(
        container.height - (getYTop() + currentEl.height)
      );
      break;
    case "bottom":
      pos.top = Math.floor(getYBottom());
      break;
    case "center":
      pos.top = Math.floor(getYCenter());
    // - currentEl.height / 2
    // pos.transform = 'translate(0, 50%)'
  }
  switch (position[0].horizontal) {
    case "left":
      pos.right = Math.floor(container.width - (getXLeft() + currentEl.width));
      break;
    case "right":
      pos.left = Math.floor(getXRight());
      break;
    case "center":
      // if (hasLeftCenterSpace()){
      //     pos.right = container.width - (getXCenter() +currentEl.width/2)
      //     pos.transform = 'translate(50%, 0)'
      // }else {
      pos.left = Math.floor(getXCenter());
    // - currentEl.width / 2
    // pos.transform = 'translate(50%, 0)'
    // }
  }
  return pos;
};
