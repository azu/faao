// MIT © 2017 azu
import * as React from "react";
import {
    ContextualMenu,
    DefaultButton,
    DirectionalHint,
    IconButton,
    Link,
    List
} from "office-ui-fabric-react";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { SyntheticEvent } from "react";
import { GitHubSetting } from "../../../domain/GitHubSetting/GitHubSetting";

export interface GitHubSettingListItemProps {
    setting: GitHubSetting;
    onClickSetting: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
    onEditSetting: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
    onDeleteSetting: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
}

export interface GitHubSettingListItemState {
    contextTarget?: EventTarget;
    isContextMenuVisible: boolean;
}

export class GitHubSettingListItem extends React.Component<
    GitHubSettingListItemProps,
    GitHubSettingListItemState
> {
    state = {
        contextTarget: undefined,
        isContextMenuVisible: false
    };

    onClickOpenContextMenu = (event: React.MouseEvent<any>) => {
        this.setState({ contextTarget: event.target, isContextMenuVisible: true });
    };

    render() {
        const onClick = (event: SyntheticEvent<any>) => {
            this.props.onClickSetting(event, this.props.setting);
        };
        const contextMenu = this.state.contextTarget && this.state.isContextMenuVisible
            ? <ContextualMenu
                  shouldFocusOnMount={true}
                  target={this.state.contextTarget}
                  directionalHint={DirectionalHint.rightBottomEdge}
                  onDismiss={() => {
                      this.setState({
                          contextTarget: undefined,
                          isContextMenuVisible: false
                      });
                  }}
                  items={[
                      {
                          key: "edit-setting",
                          iconProps: {
                              iconName: "Edit"
                          },
                          onClick: (event: React.MouseEvent<any>) => {
                              this.props.onEditSetting(event, this.props.setting);
                          },
                          name: "Edit Setting"
                      },
                      {
                          key: "delete-setting",
                          iconProps: {
                              iconName: "Delete"
                          },
                          onClick: (event: React.MouseEvent<any>) => {
                              if (confirm(`Does delete "${this.props.setting.id.toValue()}"?`)) {
                                  this.props.onDeleteSetting(event, this.props.setting);
                              }
                          },
                          name: "Delete Setting"
                      }
                  ]}
              />
            : null;
        return (
            <div className="GitHubSettingListItem">
                {contextMenu}
                <Link className="GitHubSettingListItem-button" onClick={onClick}>
                    <span className="GitHubSettingListItem-primaryText">
                        {this.props.setting.id.toValue()}
                    </span>
                </Link>

                <IconButton
                    className="GitHubSettingListItem-settingButton"
                    iconProps={{ iconName: "Settings" }}
                    title="Open Context Menu"
                    ariaLabel="Open Context Menu"
                    text={"More"}
                    onClick={this.onClickOpenContextMenu}
                />

            </div>
        );
    }
}

export interface GitHubSettingListProps {
    settings: GitHubSetting[];
    onClickSetting: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
    onEditSetting: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
    onDeleteSetting: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
}

export class GitHubSettingList extends React.Component<GitHubSettingListProps, {}> {
    render() {
        return (
            <List
                className="GitHubSettingList"
                items={this.props.settings}
                getKey={(setting: GitHubSetting) => {
                    return setting.id.toValue();
                }}
                onRenderCell={(setting: GitHubSetting) =>
                    <GitHubSettingListItem
                        key={setting.id.toValue()}
                        setting={setting}
                        onClickSetting={this.props.onClickSetting}
                        onEditSetting={this.props.onEditSetting}
                        onDeleteSetting={this.props.onDeleteSetting}
                    />}
            />
        );
    }
}
