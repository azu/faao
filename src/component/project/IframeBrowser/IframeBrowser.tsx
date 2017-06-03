// MIT © 2017 azu
import * as React from "react";

export interface IframeBrowserProps {
    html: string;
}

export default class IframeBrowser extends React.Component<IframeBrowserProps, {}> {
    render() {
        return <iframe srcDoc={this.props.html}/>
    }
}