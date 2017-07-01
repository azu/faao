// MIT © 2017 azu
import * as React from "react";
import { IconButton } from "office-ui-fabric-react";
import { BaseContainer } from "../../../BaseContainer";
import { createReloadActiveStreamUseCase } from "../../../../../use-case/GitHubSearchStream/ReloadActiveStreamUseCase";
import classNames from "classnames";
import { ExpandableSearch } from "../../../../project/ExpandableSearch/ExpandableSearch";
import { createApplyFilterToCurrentUserActivityUseCase } from "../../../../../use-case/GitHubUser/ApplyFilterToCurrentUserActivityUseCase";

export interface GitHubSearchStreamCommandBarContainerProps {
    className?: string;
    filterWord?: string;
}

export class GitHubSearchStreamCommandBarContainer extends BaseContainer<
    GitHubSearchStreamCommandBarContainerProps,
    {}
> {
    onClickRefreshButton = () => {
        this.useCase(createReloadActiveStreamUseCase()).executor(useCase => useCase.execute());
    };

    onChangeSearchValue = (value: any) => {
        if (typeof value === "string") {
            this.useCase(createApplyFilterToCurrentUserActivityUseCase()).executor(useCase =>
                useCase.execute(value)
            );
        }
    };

    render() {
        return (
            <div
                className={classNames(
                    "GitHubSearchStreamCommandBarContainer",
                    this.props.className
                )}
            >
                <ExpandableSearch
                    className="ExpandableSearchBox-searchBox"
                    value={this.props.filterWord}
                    onChangeValue={this.onChangeSearchValue}
                />
                <IconButton
                    className="ExpandableSearchBox-reloadButton"
                    iconProps={{ iconName: "Refresh" }}
                    title="Refresh this stream"
                    ariaLabel="Refresh this stream"
                    text={"Refresh"}
                    onClick={this.onClickRefreshButton}
                />
            </div>
        );
    }
}
