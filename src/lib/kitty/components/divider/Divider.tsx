import classNames from "classnames";

import './divider.scss'

type props = {
    type?: "fullWidth" | "center" | "intent"
}
// TODO: full width
export const Divider = ({type="intent"}: props) => {
    return (
        <div className={classNames(
            "divider-wrapper",
            type === "fullWidth" && "full-width",
            type === "center" && "center",
        )}>
            <div className="divider"/>
        </div>
    );
};
