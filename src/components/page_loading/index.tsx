import { LoadingIndicator } from "kitty";
import { useEffect, useState } from "react";

type props = {
  position?: "top" | "center" | "bottom";
};

export const PageLoading = ({ position = "center" }: props) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(setShow, 100, true);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop:
          position === "top" ? "20vh" : position === "center" ? "50vh" : "80vh",
        visibility: show ? "visible" : "hidden",
      }}
    >
      <LoadingIndicator size="2.5rem" frame={false} />
    </div>
  );
};
