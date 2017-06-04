// MIT © 2017 azu
import React from "react";
import {
    Button, Dropdown, Panel, TextField, PrimaryButton, Label, PanelType,
    IDropdownOption
} from "office-ui-fabric-react";
import {
    GitHubSearchQueryJSON
} from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSetting } from "../../../domain/GitHubSetting/GitHubSetting";

export interface QuickIssuePanelProps {
    settings: GitHubSetting[];

    isOpen: boolean;
    // when close panel
    onDismiss: () => void;
    // when submit from panel
    onSubmit: (queryJSON: GitHubSearchQueryJSON) => void;
}

export class QuerySettingPanel extends React.Component<QuickIssuePanelProps, {}> {
    state = {
        query: "",
        name: "",
        color: ""
    };

    onChanged = (option: IDropdownOption) => {
        this.setState({
            issueURL: option.text
        });
    };

    onSubmit = () => {
    };

    render() {
        console.log(this.props.settings);
        return <Panel
            isOpen={ this.props.isOpen }
            type={ PanelType.medium }
            isLightDismiss={ true }
            headerText='Query Settings'
            onDismiss={ () => this.props.onDismiss() }
        >
            <Dropdown
                label='GitHub:'
                onChanged={this.onChanged}
                options={
                    this.props.settings.map(setting => {
                        console.log(setting.id.toValue());
                        return {
                            key: String(setting.id.toValue()),
                            text: `${setting.apiHost}@${setting.token.slice(0, 10)}...`
                        };
                    })
                }
            />
            <TextField
                label='Name of setting:'
                onChanged={(text) => {
                    console.log(text);
                    this.setState({ name: text });
                }}
            />
            <TextField
                label='Query:'
                onChanged={(text) => this.setState({ query: text })}
            />
            <Label>Save Query</Label>
            <PrimaryButton
                onClick={this.onSubmit}
                data-automation-id='test'
                ariaDescription='Save query'>
                Save
            </PrimaryButton>
        </Panel>;

    }
}