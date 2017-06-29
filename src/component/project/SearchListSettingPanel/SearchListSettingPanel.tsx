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
import {
    GitHubSearchList,
    GitHubSearchListJSON
} from "../../../domain/GitHubSearchList/GitHubSearchList";

export interface SearchListSettingPanelProps {
    gitHubSearchList?: GitHubSearchList;
    isOpen: boolean;
    // when close panel
    onDismiss: () => void;
    // when submit from panel
    onSubmit: (gitHubSearchListJSON: Pick<GitHubSearchListJSON, "name">) => void;
}

export interface SearchListSettingPanelState {
    name: string;
    error: Error | null;
}

export class SearchListSettingPanel extends React.Component<
    SearchListSettingPanelProps,
    SearchListSettingPanelState
> {
    state = {
        name: "",
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
                    name: this.state.name
                });
            }
        );
    };

    validateForm = (): Error | boolean => {
        if (this.state.name.length === 0) {
            return new Error("Please input name");
        }
        return true;
    };

    updateState = (gitHubSearchList: GitHubSearchList) => {
        this.setState({
            name: gitHubSearchList.name
        });
    };

    componentWillMount() {
        if (this.props.gitHubSearchList) {
            this.updateState(this.props.gitHubSearchList);
        }
    }

    componentWillReceiveProps(nextProps: SearchListSettingPanelProps) {
        if (nextProps.gitHubSearchList) {
            this.updateState(nextProps.gitHubSearchList);
        }
    }

    render() {
        const errorMessage = this.state.error
            ? <MessageBar messageBarType={MessageBarType.error}>
                  {String(this.state.error)}
              </MessageBar>
            : null;
        const headerText = this.props.gitHubSearchList === undefined
            ? "Add new Search List"
            : "Edit Search List";
        return (
            <Panel
                className="SearchListSettingPanel"
                isOpen={this.props.isOpen}
                type={PanelType.medium}
                isLightDismiss={true}
                headerText={headerText}
                onDismiss={() => this.props.onDismiss()}
            >
                <TextField
                    label="Name:"
                    placeholder="Search List name"
                    autoFocus={true}
                    defaultValue={this.state.name}
                    onChanged={text => this.setState({ name: text })}
                />
                <p className="ms-font-xs SearchListSettingPanel-itemDescription">
                    <a href="https://github.com/settings/tokens">Personal Access Tokens</a> should
                    have <b>repo</b>
                    permission.
                </p>
                <div className="SearchListSettingPanel-footer">
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
