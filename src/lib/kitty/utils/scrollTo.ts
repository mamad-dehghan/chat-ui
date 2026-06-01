export const scrollToElement = (el: Element | undefined) => {
  console.log(
    el?.parentElement?.scrollTop,
    el?.getBoundingClientRect().top,
    el?.parentElement?.scrollLeft,
    el?.getBoundingClientRect().left,
  );
  el?.parentElement?.scrollTo({
    top: el?.getBoundingClientRect().top,
    left: el?.getBoundingClientRect().left,
    behavior: "smooth",
  });
};
