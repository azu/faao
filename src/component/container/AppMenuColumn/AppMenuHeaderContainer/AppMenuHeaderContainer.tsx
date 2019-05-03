// MIT © 2017 azu
import * as React from "react";
import { GitHubSearchListState } from "../../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { BaseContainer } from "../../BaseContainer";
import { CommandBar } from "office-ui-fabric-react";
import { OpenQuickIssueUseCase } from "../../../../use-case/QuickIssue/OpenQuickIssueUseCase";
import { GitHubSettingState } from "../../../../store/GitHubSettingStore/GitHubSettingStore";
import { AppState } from "../../../../store/AppStore/AppStore";

export interface AppMenuHeaderContainerProps {
    className?: string;
    app: AppState;
    gitHubSetting: GitHubSettingState;
    gitHubSearchList: GitHubSearchListState;
}

export class AppMenuHeaderContainer extends BaseContainer<AppMenuHeaderContainerProps, {}> {
    menuItems = [
        {
            key: "newItem",
            name: "Quick Issue",
            iconProps: {
                iconName: "EditMirrored"
            },
            ariaLabel: "Quick New Issue",
            onClick: () => {
                this.useCase(new OpenQuickIssueUseCase()).execute();
            }
        }
    ];

    render() {
        return (
            <header className="AppMenuHeaderContainer">
                <CommandBar items={this.menuItems} />
            </header>
        );
    }
}
