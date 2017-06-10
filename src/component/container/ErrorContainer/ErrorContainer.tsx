import * as React from "react";

export interface ErrorContainerProps {
    error?: Error;
}

export class ErrorContainer extends React.Component<{}, {}> {
    render() {
        return <div className="ErrorContainer" />;
    }
}
