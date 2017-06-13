// MIT © 2017 azu
import * as React from "react";

export interface ColorBarProps {
    color: string;
    height?: number | string;
}

export class ColorBar extends React.Component<ColorBarProps, {}> {
    static defaultProps() {
        return {
            height: "2px"
        };
    }

    render() {
        const style = {
            height: this.props.height,
            backgroundColor: this.props.color
        };
        return <div className="ColorBar" style={style} />;
    }
}
