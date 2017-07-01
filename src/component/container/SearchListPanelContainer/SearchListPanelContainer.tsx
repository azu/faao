// MIT © 2017 azu
import * as React from "react";
import { BaseContainer } from "../BaseContainer";
import { SearchListSettingPanel } from "../../project/SearchListSettingPanel/SearchListSettingPanel";
import { GitHubSearchListJSON } from "../../../domain/GitHubSearchList/GitHubSearchList";
import { GitHubSearchListState } from "../../../store/GitHubSearchListStore/GitHubSearchListStore";
import { CloseSearchListPanelUseCase } from "../../../use-case/GitHubSearchList/ToggleSearchListPanelUseCase";
import { createAddSearchListUseCase } from "../../../use-case/GitHubSearchList/AddSearchListUseCase";

export interface SearchListPanelContainerProps {
    gitHubSearchList: GitHubSearchListState;
}

export class SearchListPanelContainer extends BaseContainer<SearchListPanelContainerProps, {}> {
    onDismiss = () => {
        this.useCase(new CloseSearchListPanelUseCase()).executor(useCase => useCase.execute());
    };

    onSubmit = async (gitHubSearchListJSON: Pick<GitHubSearchListJSON, "name">) => {
        await this.useCase(createAddSearchListUseCase()).executor(useCase =>
            useCase.execute(gitHubSearchListJSON.name)
        );
        await this.useCase(new CloseSearchListPanelUseCase()).executor(useCase =>
            useCase.execute()
        );
    };

    render() {
        return (
            <SearchListSettingPanel
                isOpen={this.props.gitHubSearchList.isSearchListPanelOpened}
                onDismiss={this.onDismiss}
                onSubmit={this.onSubmit}
                gitHubSearchList={undefined}
            />
        );
    }
}
