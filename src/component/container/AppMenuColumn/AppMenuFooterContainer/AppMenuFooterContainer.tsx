// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { BaseContainer } from "../../BaseContainer";
import { CommandBarButton } from "office-ui-fabric-react";
import { GitHubSettingState } from "../../../../store/GitHubSettingStore/GitHubSettingStore";
import { AppState } from "../../../../store/AppStore/AppStore";
import { OpenProfileWindowUseCase } from "../../../../use-case/Profile/ToggleProfileWindowUseCase";
import { createExportProfileUseCase } from "../../../../use-case/Profile/ExportProfileUseCase";
import { OpenSearchListPanelUseCase } from "../../../../use-case/GitHubSearchList/ToggleSearchListPanelUseCase";

export interface AppMenuFooterContainerProps {
    className?: string;
    app: AppState;
    gitHubSetting: GitHubSettingState;
    gitHubSearchList: GitHubSearchListState;
}

export class AppMenuFooterContainer extends BaseContainer<AppMenuFooterContainerProps, {}> {
    render() {
        return (
            <footer className="AppMenuFooterContainer">
                <CommandBarButton
                    className={"AppMenuFooterContainer-optionButton"}
                    data-automation-id="AppMenuFooterContainer"
                    disabled={false}
                    iconProps={{ iconName: "Settings" }}
                    text="Options"
                    menuProps={{
                        items: [
                            {
                                key: "newSearchList",
                                name: "Add New SearchList",
                                iconProps: {
                                    iconName: "EditMirrored"
                                },
                                ariaLabel: "Add new SearchList",
                                onClick: () => {
                                    this.useCase(new OpenSearchListPanelUseCase()).executor(
                                        useCase => useCase.execute()
                                    );
                                }
                            },
                            {
                                key: "profile",
                                name: "Imports/Exports Profile",
                                iconProps: {
                                    iconName: "Settings"
                                },
                                ariaLabel: "Imports/Exports Profile",
                                onClick: () => {
                                    (async () => {
                                        await this.useCase(new OpenProfileWindowUseCase()).executor(
                                            useCase => useCase.execute()
                                        );
                                        await this.useCase(createExportProfileUseCase()).executor(
                                            useCase => useCase.execute()
                                        );
                                    })();
                                }
                            }
                        ]
                    }}
                />
            </footer>
        );
    }
}
