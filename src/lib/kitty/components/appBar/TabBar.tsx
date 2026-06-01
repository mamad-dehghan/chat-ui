import { Icon } from "@phosphor-icons/react";
import classNames from "classnames";
import {
  LazyExoticComponent,
  ReactElement,
  Suspense,
  UIEventHandler,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import "./tabbar.scss";

type iconTab = {
  title: string;
  isActive: boolean;
  Icon: Icon;
  index: number;
  PageContent: LazyExoticComponent<() => ReactElement> | (() => ReactElement);
  PageLoadder?: LazyExoticComponent<() => ReactElement> | (() => ReactElement);
  parentId: string;
};

type simpleTab = {
  title: string;
  isActive: boolean;
  Icon?: never;
  index: number;
  PageContent: LazyExoticComponent<() => ReactElement> | (() => ReactElement);
  PageLoadder?: LazyExoticComponent<() => ReactElement> | (() => ReactElement);
  parentId: string;
};

type props = {
  tabs: Omit<iconTab | simpleTab, "isActive" | "index" | "parentId">[];
  initialActiveTab?: string;
};
// TODO: implement indicator with css transition and after sudo element
export const TabBar = ({ tabs, initialActiveTab }: props) => {
  const id = useId();
  const [activeTab, setActive] = useState<string>(
    initialActiveTab && tabs.some((t) => t.title === initialActiveTab)
      ? initialActiveTab
      : tabs[0].title,
  );

  const activeTabIndex = useMemo(
    () => tabs.findIndex((tab) => tab.title === activeTab),
    [tabs, activeTab],
  );
  const [{ width, left }, setIndicatorStyle] = useState<{
    width: string;
    left: string;
  }>({
    width: "0px",
    left: `${(100 * (activeTabIndex * 2 + 1)) / (tabs.length * 2)}%`,
  });
  // const { width, left } = useMemo<{ width: string; left: string }>(() => {
  //   const parent = document.getElementById(id);
  //   const titleRect =
  //     parent?.getElementsByClassName("tab-title")?.[activeTabIndex];
  //   if (parent && titleRect) {
  //     return {
  //       width: Math.round(titleRect.getBoundingClientRect().width) + "px",
  //       left: `${Math.round(
  //         titleRect.getBoundingClientRect().left +
  //           titleRect.getBoundingClientRect().width / 2 -
  //           parent.getBoundingClientRect().left,
  //       )}px`,
  //     };
  //   }

  //   return {
  //     width: "0px",
  //     left: `${(100 * (activeTabIndex * 2 + 1)) / (tabs.length * 2)}%`,
  //   };
  // }, [id, activeTabIndex, tabs]);

  useLayoutEffect(() => {
    const parent = document.getElementById(id);
    const titleRect =
      parent?.getElementsByClassName("tab-title")?.[activeTabIndex];
    if (parent && titleRect) {
      setIndicatorStyle({
        width: Math.round(titleRect.getBoundingClientRect().width) + "px",
        left: `${Math.round(
          titleRect.getBoundingClientRect().left +
            titleRect.getBoundingClientRect().width / 2 -
            parent.getBoundingClientRect().left,
        )}px`,
      });
    }
  }, [tabs, id, activeTabIndex]);

  const onScroll = useCallback<UIEventHandler<HTMLDivElement>>(
    (event) => {
      const { target } = event;
      const activeIndex = Math.round(
        (target as HTMLDivElement).scrollLeft /
          (target as HTMLDivElement).getBoundingClientRect().width,
      );
      setActive(tabs[activeIndex].title);
    },
    [tabs],
  );

  return (
    <div className="tab-page" id={id}>
      <div className="tab-bar">
        {tabs.map((tab, index) => (
          <Tab
            key={tab.title}
            parentId={id}
            {...tab}
            index={index}
            isActive={index === activeTabIndex}
          />
        ))}
        <hr
          className="tab-indicator"
          style={{
            // @ts-expect-error define css variables
            "--width": width ?? "4px",
            "--left": left ?? "24px",
          }}
        />
      </div>
      <div
        className="page-content-wrapper"
        onScroll={onScroll}
        onScrollEnd={onScroll}
      >
        {tabs.map((tab, index) => (
          <TabPage
            key={tab.title}
            tab={tab}
            isActive={index === activeTabIndex}
            shouldLoad={Math.abs(index - activeTabIndex) < 2}
          />
        ))}
      </div>
    </div>
  );
};

const Tab = ({
  title,
  Icon,
  isActive,
  index,
  parentId,
}: iconTab | simpleTab) => {
  const onClickHandler = useCallback(() => {
    const parent = document
      .getElementById(parentId)
      ?.getElementsByClassName("page-content-wrapper")[0];
    parent?.scroll({
      left: parent.clientWidth * index,
      behavior: "smooth",
    });
  }, [index, parentId]);
  return (
    <button
      className={classNames("tab", Icon && "has-icon", isActive && "active")}
      onClick={onClickHandler}
    >
      <div className="tab-content">
        <div className="tab-icon">
          {Icon ? <Icon weight={isActive ? "fill" : "regular"} /> : undefined}
        </div>
        <div className="tab-title">{title}</div>
      </div>
    </button>
  );
};

const TabPage = ({
  tab,
  isActive,
  shouldLoad,
}: {
  tab: Pick<iconTab, "PageContent" | "PageLoadder">;
  isActive: boolean;
  shouldLoad: boolean;
}) => {
  return (
    <div className={classNames("page", isActive && "active")} inert={!isActive}>
      {shouldLoad ? (
        isActive || !tab.PageLoadder ? (
          <Suspense>
            <tab.PageContent />
          </Suspense>
        ) : (
          <Suspense>
            <tab.PageLoadder />
          </Suspense>
        )
      ) : undefined}
    </div>
  );
};
