// MIT © 2017 azu
import * as React from "react";

export class EmptySearchResultListProps {
    children?: React.ReactChildren;
}

export class EmptySearchResultList extends React.Component<EmptySearchResultListProps, {}> {
    render() {
        return (
            <div className="EmptySearchResultList">
                <div className="EmptySearchResultList-inner">
                    {this.props.children ? this.props.children : "No data"}
                </div>
            </div>
        );
    }
}
