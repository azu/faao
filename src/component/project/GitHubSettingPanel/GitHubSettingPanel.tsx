// MIT © 2017 azu
import React from "react";
import {
    MessageBar,
    MessageBarType,
    Panel,
    PanelType,
    PrimaryButton,
    TextField
} from "office-ui-fabric-react";
import { GitHubSetting, GitHubSettingJSON } from "../../../domain/GitHubSetting/GitHubSetting";

export interface GitHubSettingPanelProps {
    settings: GitHubSetting[];
    setting?: GitHubSetting;
    isOpen: boolean;
    // when close panel
    onDismiss: () => void;
    // when submit from panel
    onSubmit: (settingJSON: GitHubSettingJSON) => void;
}

export interface GitHubSettingPanelState {
    id: string;
    token: string;
    apiHost: string;
    webHost: string;
    error: Error | null;
}

export class GitHubSettingPanel extends React.Component<
    GitHubSettingPanelProps,
    GitHubSettingPanelState
> {
    state = {
        id: "",
        token: "",
        apiHost: "https://api.github.com",
        webHost: "https://github.com",
        error: null
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
                    id: this.state.id,
                    token: this.state.token,
                    apiHost: this.state.apiHost,
                    webHost: this.state.webHost
                });
            }
        );
    };

    validateForm = (): Error | boolean => {
        if (this.state.id.length === 0) {
            return new Error("Please input unique id");
        }
        if (this.state.token.length === 0) {
            return new Error("Please input valid token");
        }
        if (this.state.apiHost.length === 0) {
            return new Error("Please input apiHost base url");
        }
        if (this.state.webHost.length === 0) {
            return new Error("Please input webHost base url");
        }
        return true;
    };

    updateStateWithSetting = (setting: GitHubSetting) => {
        this.setState({
            id: setting.id.toValue(),
            token: setting.token,
            apiHost: setting.apiHost,
            webHost: setting.webHost
        });
    };

    componentWillMount() {
        if (this.props.setting) {
            this.updateStateWithSetting(this.props.setting);
        }
    }

    componentWillReceiveProps(nextProps: GitHubSettingPanelProps) {
        if (nextProps.setting) {
            this.updateStateWithSetting(nextProps.setting);
        }
    }

    render() {
        const errorMessage = this.state.error
            ? <MessageBar messageBarType={MessageBarType.error}>
                  {String(this.state.error)}
              </MessageBar>
            : null;
        const headerText = this.props.setting === undefined
            ? "Add new GitHub Setting"
            : "Edit GitHub Setting";
        return (
            <Panel
                className="GitHubSettingPanel"
                isOpen={this.props.isOpen}
                type={PanelType.medium}
                isLightDismiss={true}
                headerText={headerText}
                onDismiss={() => this.props.onDismiss()}
            >
                <TextField
                    label="id:"
                    placeholder="unique id of the setting"
                    defaultValue={this.state.id}
                    onChanged={text => {
                        this.setState({ id: text });
                    }}
                />
                <TextField
                    label="Token:"
                    placeholder="GitHub Personal token"
                    defaultValue={this.state.token}
                    onChanged={text => this.setState({ token: text })}
                />
                <p className="ms-font-xs GitHubSettingPanel-itemDescription">
                    <a href="https://github.com/settings/tokens">Personal Access Tokens</a> should
                    have <b>repo</b>
                    permission.
                </p>
                <TextField
                    label="apiHost:"
                    value={this.state.apiHost}
                    placeholder="https://api.github.com"
                    onChanged={text => this.setState({ apiHost: text })}
                />

                <TextField
                    label="webHost:"
                    value={this.state.webHost}
                    placeholder="https://github.com"
                    onChanged={text => this.setState({ webHost: text })}
                />
                <div className="GitHubSettingPanel-footer">
                    {errorMessage}
                    <PrimaryButton
                        onClick={this.onSubmit}
                        data-automation-id="save-setting"
                        ariaDescription="Save setting"
                    >
                        Save
                    </PrimaryButton>
                </div>
            </Panel>
        );
    }
}
