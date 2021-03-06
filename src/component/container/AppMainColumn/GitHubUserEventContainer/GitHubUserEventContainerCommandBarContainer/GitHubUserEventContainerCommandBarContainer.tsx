// MIT © 2017 azu
import * as React from "react";
import { IconButton } from "office-ui-fabric-react";
import { BaseContainer } from "../../../BaseContainer";
import classNames from "classnames";
import { ExpandableSearch } from "../../../../project/ExpandableSearch/ExpandableSearch";
import { createReloadCurrentUserActivityUseCase } from "../../../../../use-case/GitHubUser/ReloadCurrentUserActivityUseCase";
import { createApplyFilterToCurrentUserActivityUseCase } from "../../../../../use-case/GitHubUser/ApplyFilterToCurrentUserActivityUseCase";

export interface GitHubUserEventContainerCommandBarContainerProps {
    className?: string;
    filterWord?: string;
}

export class GitHubUserEventContainerCommandBarContainer extends BaseContainer<
    GitHubUserEventContainerCommandBarContainerProps,
    {}
> {
    onClickRefreshButton = () => {
        this.useCase(createReloadCurrentUserActivityUseCase()).execute();
    };

    onChangeSearchValue = (value: any) => {
        if (typeof value === "string") {
            this.useCase(createApplyFilterToCurrentUserActivityUseCase()).execute(value);
        }
    };

    render() {
        return (
            <div
                className={classNames(
                    "GitHubUserEventContainerCommandBarContainer",
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
