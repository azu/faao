// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import {
    ContextualMenu,
    ContextualMenuItemType,
    DirectionalHint,
    Facepile,
    FocusZoneDirection,
    IFacepilePersona,
    IFacepileProps,
    PersonaSize
} from "office-ui-fabric-react";
import { GitHubSetting } from "../../../domain/GitHubSetting/GitHubSetting";
import { GitHubSettingViewModel } from "../../../store/GitHubSettingStore/GitHubSettingStore";

export const createFacepilePersonas = (
    settings: GitHubSettingViewModel[],
    onClickHandler: (
        event: React.MouseEvent<HTMLElement> | undefined,
        setting: GitHubSetting
    ) => void
): IFacepilePersona[] => {
    return settings.map(
        (setting): IFacepilePersona => {
            return {
                personaName: setting.id.toValue(),
                imageUrl: setting.avatarURL,
                onClick: (event: React.MouseEvent<HTMLElement> | undefined) => {
                    onClickHandler(event || undefined, setting);
                }
            };
        }
    );
};

export interface GitHubSettingListProps {
    settings: GitHubSetting[];
    onClickAddSetting: (event: SyntheticEvent<any>) => void;
    onClickSetting: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
    onEditSetting: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
    onRefreshSetting: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
    onDeleteSetting: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
    onShowUserEvents: (event: SyntheticEvent<any>, setting: GitHubSetting) => void;
}

export interface GitHubSettingListState {
    contextTarget?: EventTarget & HTMLElement;
    contextTargetSetting?: GitHubSetting;
    isContextMenuVisible: boolean;
}

export class GitHubSettingList extends React.Component<
    GitHubSettingListProps,
    GitHubSettingListState
> {
    constructor(props: GitHubSettingListProps) {
        super(props);
        this.state = {
            contextTarget: undefined,
            contextTargetSetting: undefined,
            isContextMenuVisible: false
        };
    }

    showContextMenu = (event: React.MouseEvent<HTMLElement>, setting: GitHubSetting) => {
        this.setState({
            contextTarget: event.currentTarget,
            contextTargetSetting: setting,
            isContextMenuVisible: true
        });
    };

    onClick = (event: React.MouseEvent<HTMLElement> | undefined, setting: GitHubSetting) => {
        if (!event) {
            return;
        }
        this.props.onClickSetting(event, setting);
        this.showContextMenu(event, setting);
    };
    onEditSetting = (event: React.MouseEvent<HTMLElement>) => {
        const setting = this.state.contextTargetSetting;
        if (setting) {
            this.props.onEditSetting(event, setting);
        }
    };

    onRefreshSetting = (event: React.MouseEvent<HTMLElement>) => {
        const setting = this.state.contextTargetSetting;
        if (setting) {
            this.props.onRefreshSetting(event, setting);
        }
    };

    onDeleteSetting = (event: React.MouseEvent<HTMLElement>) => {
        const setting = this.state.contextTargetSetting;
        if (setting) {
            if (confirm(`Does delete "${setting.id.toValue()}"?`)) {
                this.props.onDeleteSetting(event, setting);
            }
        }
    };

    onShowUserEvents = (event: React.MouseEvent<HTMLElement>) => {
        const setting = this.state.contextTargetSetting;
        if (setting) {
            this.props.onShowUserEvents(event, setting);
        }
    };

    render() {
        const contextTarget = this.state.contextTarget;
        const contextMenu =
            contextTarget && this.state.isContextMenuVisible ? (
                <ContextualMenu
                    shouldFocusOnMount={true}
                    target={contextTarget}
                    directionalHint={DirectionalHint.bottomRightEdge}
                    arrowDirection={FocusZoneDirection.vertical}
                    onDismiss={() => {
                        this.setState({
                            contextTarget: undefined,
                            isContextMenuVisible: false
                        });
                    }}
                    items={[
                        {
                            key: "label",
                            itemType: ContextualMenuItemType.Header,
                            name: this.state.contextTargetSetting!.id.toValue()
                        },
                        {
                            key: "show-events",
                            iconProps: {
                                iconName: "Heart"
                            },
                            onClick: (event?: React.MouseEvent<HTMLElement>) => {
                                if (!event) {
                                    return;
                                }
                                this.onShowUserEvents(event);
                            },
                            name: "Show events"
                        },
                        {
                            key: "refresh-setting",
                            iconProps: {
                                iconName: "Refresh"
                            },
                            onClick: (event?: React.MouseEvent<HTMLElement>) => {
                                if (!event) {
                                    return;
                                }
                                this.onRefreshSetting(event);
                            },
                            name: "Refresh Setting"
                        },
                        {
                            key: "edit-setting",
                            iconProps: {
                                iconName: "Edit"
                            },
                            onClick: (event?: React.MouseEvent<HTMLElement>) => {
                                if (!event) {
                                    return;
                                }
                                this.onEditSetting(event);
                            },
                            name: "Edit Setting"
                        },
                        {
                            key: "delete-setting",
                            iconProps: {
                                iconName: "Delete"
                            },
                            onClick: (event?: React.MouseEvent<HTMLElement>) => {
                                if (!event) {
                                    return;
                                }
                                this.onDeleteSetting(event);
                            },
                            name: "Delete Setting"
                        }
                    ]}
                />
            ) : null;
        const facepileProps: IFacepileProps = {
            personaSize: PersonaSize.small,
            personas: createFacepilePersonas(this.props.settings, this.onClick),
            ariaDescription: "Your GitHub account setting list",
            showAddButton: true,
            addButtonProps: {
                ariaLabel: "Add a setting",
                onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                    this.props.onClickAddSetting(event);
                }
            }
        };
        return (
            <div className="GitHubSettingList">
                {contextMenu}
                <h1 className="GitHubSettingList-title ms-font-xxl">Accounts</h1>
                <Facepile {...facepileProps} />
            </div>
        );
    }
}
