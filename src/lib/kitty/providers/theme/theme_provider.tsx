import {
  createContext,
  CSSProperties,
  ReactNode,
  useEffect,
  useInsertionEffect,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";

import "../../styles/globals.css";
// import "./typography.scss";
import "./palette.scss";

import "./index.scss";
import { getCookie, setCookie } from "typescript-cookie";
// import {readProfile, updateProfile} from "../../utils/database/profile";
// import {useBeforeUnload} from "react-router-dom";

export type themeT = {
  "--primary-hue": number;
  "--secondary-hue": number;
  "--tertiary-hue": number;
  // error:number;
  // warning:number;
  // success:number;
};

const randomColor = Math.floor(Math.random() * 300);

// const themeOnPreference = JSON.parse((await readProfile())?.["preference"] ?? "{}")
const defaultTheme: themeT = {
  // "--primary-hue": Number(getCookie("primary")) || 260,
  // "--secondary-hue": Number(getCookie("secondary")) || 250,
  // "--tertiary-hue": Number(getCookie("tertiary")) || 20,
  // "--primary-hue": 260,
  "--primary-hue": randomColor,
  "--secondary-hue": randomColor + 100,
  "--tertiary-hue": randomColor + 200,
};

// TODO: default is light not user schema
const defaultDarkMode = getCookie("darkMode") === "true";

type themeContextT = {
  theme: themeT;
  overrideTheme: (newTheme: Partial<themeT>) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

export const themeContext = createContext<themeContextT>({} as themeContextT);

type themeProviderT = {
  children: ReactNode;
  modify?: Partial<themeT>;
  forceDarkMode?: boolean;
};

// fix when dark mode is undefined at default dark mode value
export const ThemeProvider = ({
  children,
  modify = {},
  forceDarkMode,
}: themeProviderT) => {
  const [theme, setTheme] = useState<themeT>({ ...defaultTheme, ...modify });
  const [darkMode, setDarkMode] = useState<boolean>(
    forceDarkMode ?? defaultDarkMode,
  );
  // useEffect(() => {
  //     const preferenceTheme = {
  //         "primary": theme["--primary-hue"],
  //         "secondary": theme["--secondary-hue"],
  //         "tertiary": theme["--tertiary-hue"],
  //     }
  //     readProfile()
  //         .then(res => {
  //             updateProfile({preference: JSON.stringify({...JSON.parse(res.preference), ...preferenceTheme})})
  //         })
  // }, [theme]);
  useEffect(() => {
    setCookie("darkMode", darkMode, { expires: 365, path: "/" });
  }, [darkMode]);

  useInsertionEffect(() => {
    document
      .getElementsByClassName("header-theme-color")[0]
      ?.setAttribute(
        "content",
        darkMode
          ? `hsl(${theme["--primary-hue"]}, 100%, 87%)`
          : `hsl(${theme["--primary-hue"]}, 58%, 28%)`,
      );
  }, [theme, darkMode]);
  // useEffect(() => {
  //     document.getElementsByClassName("header-theme-color")[0]
  //         .setAttribute("content", darkMode
  //             ? `hsl(${theme["--primary-hue"]}, 100%, 87%)`
  //             : `hsl(${theme["--primary-hue"]}, 58%, 28%)`
  //         )
  // }, [theme, darkMode]);
  const setNewTheme = (newTheme: Partial<themeT>) =>
    setTheme((prevState: themeT) => ({
      ...prevState,
      ...newTheme,
    }));
  const className = classNames(
    "theme-provider",
    darkMode ? "dark-theme" : "light-theme",
  );
  const content = useMemo(() => children, []);
  return (
    <themeContext.Provider
      value={{ theme, overrideTheme: setNewTheme, darkMode, setDarkMode }}
    >
      <div
        id="theme-provider"
        className={className}
        style={theme as CSSProperties}
      >
        {content}
      </div>
    </themeContext.Provider>
  );
};
