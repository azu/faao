// MIT © 2017 azu
import React from "react";
import {
    Button, Dropdown, Panel, TextField, PrimaryButton, Label, PanelType,
    IDropdownOption
} from "office-ui-fabric-react";

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
        console.log(this.state.issueURL);
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
        return <Panel
            isOpen={ this.props.isOpen }
            type={ PanelType.medium }
            isLightDismiss={ true }
            headerText='Quick New Issue'
            onDismiss={ () => this.props.onDismiss() }
        >
            <Dropdown
                label='Issue to:'
                defaultSelectedKey='0'
                onChanged={this.onChanged}
                options={
                    this.props.newIssueURLs.map((issueURL, index) => {
                        return {
                            key: String(index),
                            text: issueURL
                        }
                    })
                }
            />
            <TextField
                label='Issue Title:'
                onChanged={(text) => {
                    console.log(text);
                    this.setState({ title: text });
                }}
            />
            <TextField
                label='Issue Body:'
                rows={ 4 }
                multiline={true}
                onChanged={(text) => this.setState({ body: text })}
            />
            <Label>Submit to Issue</Label>
            <PrimaryButton
                onClick={this.onSubmit}
                data-automation-id='test'
                ariaDescription='Submit To Issue Button'>
                Submit
            </PrimaryButton>
        </Panel>;

    }
}