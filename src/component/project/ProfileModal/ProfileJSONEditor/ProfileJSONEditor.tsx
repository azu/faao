// MIT © 2017 azu
import * as React from "react";
import classNames from "classnames";

const CodeMirror = require("react-codemirror");
require("codemirror/mode/javascript/javascript");

export interface ProfileJSONEditorProps {
    className?: string;
    code: string;
}

export interface ProfileJSONEditorState {
    value: string;
}

export class ProfileJSONEditor extends React.Component<
    ProfileJSONEditorProps,
    ProfileJSONEditorState
> {
    state = {
        value: "{}"
    };

    componentWillMount() {
        this.setState({
            value: this.props.code
        });
    }

    componentWillReceiveProps(nextProps: ProfileJSONEditorProps) {
        if (this.props.code !== nextProps.code) {
            this.setState({
                value: nextProps.code
            });
        }
    }

    render() {
        const options = {
            mode: "javascript"
        };
        console.log(this.state.value);
        return (
            <CodeMirror
                className={classNames("ProfileJSONEditor", this.props.className)}
                value={this.state.value}
                options={options}
            />
        );
    }
}
