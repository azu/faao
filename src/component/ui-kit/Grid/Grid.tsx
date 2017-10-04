import * as React from "react";
import GridCell from "./GridCell";

const classNames = require("classnames");
const suitClassNames = require("suitcss-classnames");
/**
 Usage

 <Grid>
 <GridCell col="6of12">
 contents
 </GridCell>
 <GridCell col="6nof12">>
 contents
 </GridCell>
 </Grid>
 */
export { GridCell };

export interface GridProps {
    className?: string;
    children: React.ReactChild[];
}

export class Grid extends React.Component<GridProps, {}> {
    render() {
        // <Component>--modifier
        const names = suitClassNames({
            component: "Grid"
        });
        return <div className={classNames(names, this.props.className)}>{this.props.children}</div>;
    }
}
