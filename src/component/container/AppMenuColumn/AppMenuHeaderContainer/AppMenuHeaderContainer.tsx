// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { BaseContainer } from "../../BaseContainer";
import { CommandBar, IconButton, Label } from "office-ui-fabric-react";
import { OpenQuickIssueUseCase } from "../../../../use-case/QuickIssue/OpenQuickIssueUseCase";
import { GitHubSettingState } from "../../../../store/GitHubSettingStore/GitHubSettingStore";
export interface AppMenuHeaderContainerProps {
    className?: string;
    gitHubSetting: GitHubSettingState;
    gitHubSearchList: GitHubSearchListState;
}

export class AppMenuHeaderContainer extends BaseContainer<AppMenuHeaderContainerProps, {}> {
    menuItems = [
        {
            key: "newItem",
            name: "Quick Issue",
            icon: "EditMirrored",
            ariaLabel: "Quick New Issue",
            onClick: () => {
                return this.useCase(new OpenQuickIssueUseCase()).executor(useCase =>
                    useCase.execute()
                );
            }
        }
    ];

    render() {
        return (
            <header className="AppMenuHeaderContainer">
                <CommandBar isSearchBoxVisible={false} items={this.menuItems} />
            </header>
        );
    }
}
