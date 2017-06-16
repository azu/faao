// MIT © 2017 azu
import React from "react";
import {
    Button,
    Dropdown,
    Panel,
    TextField,
    PrimaryButton,
    Label,
    PanelType,
    IDropdownOption
} from "office-ui-fabric-react";

const CodeMirror = require("react-codemirror");
require("codemirror/mode/markdown/markdown");

export interface QuickIssuePanelProps {
    newIssueURLs: string[];
    isOpen: boolean;
    // when close panel
    onDismiss: () => void;
    // when submit from panel
    onSubmit: (issueURL: string, title: string, body: string) => void;
}

export class QuickIssuePanel extends React.Component<QuickIssuePanelProps, {}> {
    state = {
        issueURL: "",
        title: "",
        body: ""
    };

    onChanged = (option: IDropdownOption) => {
        this.setState({
            issueURL: option.text
        });
    };

    onSubmit = () => {
        if (this.state.issueURL.length > 0) {
            this.props.onSubmit(this.state.issueURL, this.state.title, this.state.body);
        }
    };

    componentDidMount() {
        if (this.props.newIssueURLs.length > 0) {
            this.setState({
                issueURL: this.props.newIssueURLs[0]
            });
        }
    }

    componentWillReceiveProps(nextProps: QuickIssuePanelProps) {
        if (nextProps.newIssueURLs.length > 0) {
            this.setState({
                issueURL: nextProps.newIssueURLs[0]
            });
        }
    }

    render() {
        return (
            <Panel
                isOpen={this.props.isOpen}
                type={PanelType.medium}
                isLightDismiss={true}
                headerText="Quick New Issue"
                onDismiss={() => this.props.onDismiss()}
            >
                <Dropdown
                    label="Issue to:"
                    defaultSelectedKey="0"
                    onChanged={this.onChanged}
                    options={this.props.newIssueURLs.map((issueURL, index) => {
                        return {
                            key: String(index),
                            text: issueURL
                        };
                    })}
                />
                <TextField
                    label="Issue Title:"
                    autoFocus={true}
                    onChanged={text => {
                        this.setState({ title: text });
                    }}
                />
                <Label>Issue Body:</Label>
                {/* TODO: QuickIssuePanel-editor" can't be assigned */}
                <div className="QuickIssuePanel-editorWrapper">
                    <CodeMirror
                        classname="QuickIssuePanel-editor"
                        options={{ mode: "markdown" }}
                        onChange={(value: string) => {
                            this.setState({ body: value });
                        }}
                    />
                </div>
                <Label>Submit to Issue</Label>
                <PrimaryButton
                    onClick={this.onSubmit}
                    data-automation-id="test"
                    ariaDescription="Submit To Issue Button"
                >
                    Submit
                </PrimaryButton>
            </Panel>
        );
    }
}
