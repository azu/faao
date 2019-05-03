// MIT © 2017 azu
import React from "react";
import {
    Dropdown,
    IDropdownOption,
    MessageBar,
    MessageBarType,
    Panel,
    PanelType,
    PrimaryButton,
    TextField
} from "office-ui-fabric-react";
import { GitHubSetting } from "../../../domain/GitHubSetting/GitHubSetting";
import { ColorResult, GithubPicker } from "react-color";
import {
    FaaoSearchQuery,
    FaaoSearchQueryJSON
} from "../../../domain/GitHubSearchList/FaaoSearchQuery";

export interface QuerySettingPanelProps {
    settings: GitHubSetting[];
    query?: FaaoSearchQuery;
    isOpen: boolean;
    // when close panel
    onDismiss: () => void;
    // when submit from panel
    onSubmit: (queryJSON: FaaoSearchQueryJSON) => void;
}

export type QuerySettingPanelState = FaaoSearchQueryJSON & {
    error: Error | null;
};

export class FaaoQuerySettingPanel extends React.Component<
    QuerySettingPanelProps,
    QuerySettingPanelState
> {
    state = {
        gitHubSettingId: "",
        name: "",
        color: "", // #hex,
        searchParams: {
            params: []
        },
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
        this.setState(
            {
                error: null
            },
            () => {
                this.props.onSubmit({
                    name: this.state.name,
                    color: this.state.color,
                    searchParams: this.state.searchParams,
                    gitHubSettingId: this.state.gitHubSettingId
                });
            }
        );
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
        return true;
    };

    updateStateWithQuery = (query: FaaoSearchQuery) => {
        this.setState({
            gitHubSettingId: query.gitHubSettingId.toValue(),
            searchParams: query.searchParams,
            name: query.name,
            color: query.color.hexCode
        });
    };

    componentWillMount() {
        if (this.props.query) {
            this.updateStateWithQuery(this.props.query);
        }
    }

    componentWillReceiveProps(nextProps: QuerySettingPanelProps) {
        if (nextProps.query) {
            this.updateStateWithQuery(nextProps.query);
        }
    }

    render() {
        const errorMessage = this.state.error ? (
            <MessageBar messageBarType={MessageBarType.error}>
                {String(this.state.error)}
            </MessageBar>
        ) : null;
        return (
            <Panel
                className="QuerySettingPanel"
                isOpen={this.props.isOpen}
                type={PanelType.medium}
                isLightDismiss={true}
                headerText="Query Settings"
                onDismiss={() => this.props.onDismiss()}
            >
                <Dropdown
                    label="Select your GitHub setting:"
                    onChanged={this.onChangedDropDown}
                    defaultSelectedKey={
                        this.props.query && this.props.query.gitHubSettingId.toValue()
                    }
                    options={this.props.settings.map(setting => {
                        return {
                            key: setting.id.toValue(),
                            text: setting.id.toValue()
                        };
                    })}
                />
                <p className="ms-font-xs QuerySettingPanel-itemDescription">
                    This GitHub setting has token and api host.
                </p>
                <TextField
                    label="Name:"
                    placeholder="query name"
                    value={this.state.name}
                    onChanged={text => {
                        this.setState({ name: text });
                    }}
                />
                <TextField
                    label="Color:"
                    addonString="#"
                    value={this.state.color.replace(/^#/, "")}
                    onChanged={text => this.setState({ color: text })}
                />
                <GithubPicker onChange={this.onChangeColor} />
                <div className="QuickIssuePanelState-footer">
                    {errorMessage}
                    <PrimaryButton
                        onClick={this.onSubmit}
                        data-automation-id="save-query"
                        ariaDescription="Save query"
                    >
                        Save
                    </PrimaryButton>
                </div>
            </Panel>
        );
    }
}
