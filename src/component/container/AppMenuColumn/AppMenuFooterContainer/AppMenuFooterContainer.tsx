// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { BaseContainer } from "../../BaseContainer";
import { CommandBar } from "office-ui-fabric-react";
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
    menuItems = [
        {
            key: "newSearchList",
            name: "Add List",
            icon: "EditMirrored",
            ariaLabel: "Add new SearchList",
            onClick: () => {
                this.useCase(new OpenSearchListPanelUseCase()).executor(useCase =>
                    useCase.execute()
                );
            }
        },
        {
            key: "profile",
            name: "Imports/Exports",
            icon: "Settings",
            ariaLabel: "Imports/Exports",
            onClick: () => {
                (async () => {
                    await this.useCase(new OpenProfileWindowUseCase()).executor(useCase =>
                        useCase.execute()
                    );
                    await this.useCase(createExportProfileUseCase()).executor(useCase =>
                        useCase.execute()
                    );
                })();
            }
        }
    ];

    farItems = [];

    render() {
        return (
            <header className="AppMenuFooterContainer">
                <CommandBar items={this.menuItems} farItems={this.farItems} />
            </header>
        );
    }
}
