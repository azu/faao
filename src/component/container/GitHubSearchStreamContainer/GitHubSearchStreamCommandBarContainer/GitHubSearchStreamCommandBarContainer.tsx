// MIT © 2017 azu
import * as React from "react";
import { CommandBar, IconButton, Label } from "office-ui-fabric-react";
import { BaseContainer } from "../../BaseContainer";
import { createReloadActiveStreamUseCase } from "../../../../use-case/GitHubSearchStream/ReloadActiveStreamUseCase";
import classNames from "classnames";
import { ExpandableSearch } from "../../../project/ExpandableSearch/ExpandableSearch";
import { createApplyFilterToStreamUseCase } from "../../../../use-case/GitHubSearchStream/ApplyFilterToStreamUseCase";

export interface GitHubSearchStreamCommandBarContainerProps {
    className?: string;
    filterWord?: string;
}

export interface GitHubSearchStreamCommandBarContainerState {
    value?: string;
}

export class GitHubSearchStreamCommandBarContainer extends BaseContainer<
    GitHubSearchStreamCommandBarContainerProps,
    GitHubSearchStreamCommandBarContainerState
> {
    state = {
        value: ""
    };
    onClickRefreshButton = () => {
        this.useCase(createReloadActiveStreamUseCase()).executor(useCase => useCase.execute());
    };

    onChangeSearchValue = (value: any) => {
        if (typeof value === "string") {
            this.useCase(createApplyFilterToStreamUseCase()).executor(useCase =>
                useCase.execute(value)
            );
        }
    };

    componentDidMount() {
        this.setState({
            value: this.props.filterWord
        });
    }

    componentWillReceiveProps(nextProps: GitHubSearchStreamCommandBarContainerProps) {
        if (nextProps.filterWord) {
            this.setState({
                value: nextProps.filterWord
            });
        } else {
            this.setState({
                value: ""
            });
        }
    }

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
                    value={this.state.value}
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
