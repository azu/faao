// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { BaseContainer } from "../../BaseContainer";
import { CommandBar, IconButton, Label } from "office-ui-fabric-react";
import { OpenQuickIssueUseCase } from "../../../../use-case/QuickIssue/OpenQuickIssueUseCase";
import { GitHubSettingState } from "../../../../store/GitHubSettingStore/GitHubSettingStore";
import { AppState } from "../../../../store/AppStore/AppStore";
import { createAddSearchListUseCase } from "../../../../use-case/GitHubSearchList/AddSearchListUseCase";
import { OpenProfileWindowUseCase } from "../../../../use-case/Profile/ToggleProfileWindowUseCase";
import { createExportProfileUseCase } from "../../../../use-case/Profile/ExportProfileUseCase";

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
                return this.useCase(createAddSearchListUseCase()).executor(useCase =>
                    useCase.execute("ME")
                );
            }
        },
        {
            key: "profile",
            name: "Imports/Exports",
            icon: "Setting",
            ariaLabel: "Imports/Exports",
            onClick: async () => {
                await this.useCase(new OpenProfileWindowUseCase()).executor(useCase =>
                    useCase.execute()
                );
                await this.useCase(createExportProfileUseCase()).executor(useCase =>
                    useCase.execute()
                );
            }
        }
    ];

    farItems = [];

    render() {
        return (
            <header className="AppMenuFooterContainer">
                <CommandBar
                    isSearchBoxVisible={false}
                    items={this.menuItems}
                    farItems={this.farItems}
                />
            </header>
        );
    }
}
