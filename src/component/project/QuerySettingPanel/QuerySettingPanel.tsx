// MIT © 2017 azu
import React from "react";
import {
    Button, Dropdown, Panel, TextField, PrimaryButton, Label, PanelType,
    IDropdownOption, Callout, DefaultButton, IconButton, Link, MessageBar, MessageBarType
} from "office-ui-fabric-react";
import {
    GitHubSearchQueryJSON
} from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSetting } from "../../../domain/GitHubSetting/GitHubSetting";
import { ColorResult, GithubPicker } from 'react-color';

export interface QuickIssuePanelProps {
    settings: GitHubSetting[];
    isOpen: boolean;
    // when close panel
    onDismiss: () => void;
    // when submit from panel
    onSubmit: (queryJSON: GitHubSearchQueryJSON) => void;
}

export interface QuickIssuePanelState {
    gitHubSettingId: string,
    query: string,
    name: string,
    color: string, // #hex,
    error: Error | null
}

export class QuerySettingPanel extends React.Component<QuickIssuePanelProps, QuickIssuePanelState> {
    state = {
        gitHubSettingId: "",
        query: "",
        name: "",
        color: "", // #hex,
        error: null
    };

    onChangedDropDown = (option: IDropdownOption) => {
        this.setState({
            gitHubSettingId: String(option.key)
        });
    };

    onChangeColor = (colorResult: ColorResult) => {
        this.setState({
            color: colorResult.hex
        });
    };

    onSubmit = () => {
        const error = this.validateForm();
        if (error instanceof Error) {
            return this.setState({
                error
            });
        }
        // remove error and callback
        this.setState({
            error: null
        }, () => {
            this.props.onSubmit({
                name: this.state.name,
                query: this.state.query,
                color: this.state.color,
                gitHubSettingId: this.state.gitHubSettingId
            })
        });
    };

    validateForm = (): Error | boolean => {
        if (this.state.gitHubSettingId.length === 0) {
            return new Error("Please select GitHub setting");
        }
        if (this.state.name.length === 0) {
            return new Error("Please input query name");
        }
        if (this.state.color.length === 0) {
            return new Error("Please select color hex code");
        }
        if (this.state.color.length === 0) {
            return new Error("Please input search query");
        }
        return true;
    };

    render() {
        const errorMessage = this.state.error
            ? <MessageBar
                messageBarType={ MessageBarType.error }>{String(this.state.error)}</MessageBar>
            : null;
        return <Panel
            className="QuerySettingPanel"
            isOpen={ this.props.isOpen }
            type={ PanelType.medium }
            isLightDismiss={ true }
            headerText='Query Settings'
            onDismiss={ () => this.props.onDismiss() }
        >
            <Dropdown
                label='Select your GitHub setting:'
                onChanged={this.onChangedDropDown}
                options={
                    this.props.settings.map(setting => {
                        return {
                            key: String(setting.id.toValue()),
                            text: `${setting.apiHost}@${setting.token.slice(0, 10)}...`
                        };
                    })
                }
            />
            <p className="ms-font-xs QuerySettingPanel-itemDescription">This GitHub setting has token and api host.</p>
            <TextField
                label='Name:'
                placeholder="query name"
                onChanged={(text) => {
                    this.setState({ name: text });
                }}
            />
            <TextField
                label='Query:'
                placeholder="repo:azu/faao"
                onChanged={(text) => this.setState({ query: text })}
            />
            <p className="ms-font-xs QuerySettingPanel-itemDescription">This query is same with GitHub Search query.
                Please see <Link href="https://help.github.com/articles/searching-issues/">GitHub document</Link></p>
            <TextField
                label='Color:'
                addonString="#"
                value={this.state.color.replace(/^#/, "")}
                onChanged={(text) => this.setState({ color: text })}
            />
            <GithubPicker onChange={this.onChangeColor}/>
            <div className="QuickIssuePanelState-footer">
                {errorMessage}
                <PrimaryButton
                    onClick={this.onSubmit}
                    data-automation-id='save-query'
                    ariaDescription='Save query'>
                    Save
                </PrimaryButton>
            </div>
        </Panel>;

    }
}