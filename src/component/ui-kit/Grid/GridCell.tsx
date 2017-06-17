import * as React from "react";

const classNames = require("classnames");

export interface GridCellProps {
    className?: string;
    children: React.ReactChild | React.ReactChild[];
    col:
        | "fill"
        | "1of12"
        | "2of12"
        | "3of12"
        | "4of12"
        | "5of12"
        | "6of12"
        | "7of12"
        | "8of12"
        | "9of12"
        | "10of12"
        | "11of12"
        | "12of12"
        | "full";
}

export default class GridCell extends React.Component<GridCellProps, {}> {
    render() {
        const col = `col-${this.props.col}`;
        return (
            <div className={classNames("GridCell", col, this.props.className)}>
                {this.props.children}
            </div>
        );
    }
}
