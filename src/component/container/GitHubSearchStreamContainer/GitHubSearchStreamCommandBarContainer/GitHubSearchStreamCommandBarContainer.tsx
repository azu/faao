// MIT © 2017 azu
import * as React from "react";
import { CommandBar, IconButton, Label } from "office-ui-fabric-react";
import { BaseContainer } from "../../BaseContainer";
import { createReloadActiveStreamUseCase } from "../../../../use-case/GitHubSearchStream/ReloadActiveStreamUseCase";
import classNames from "classnames";

export interface GitHubSearchStreamCommandBarContainerProps {
    className?: string;
}

export class GitHubSearchStreamCommandBarContainer extends BaseContainer<
    GitHubSearchStreamCommandBarContainerProps,
    {}
> {
    menuItems = [
        {
            key: "Refresh",
            icon: "Refresh",
            ariaLabel: "Refresh this stream",
            onClick: () => {
                this.useCase(createReloadActiveStreamUseCase()).executor(useCase => useCase.execute());
            }
        }
    ];

    render() {
        return (
            <CommandBar
                className={classNames("GitHubSearchStreamCommandBarContainer", this.props.className)}
                isSearchBoxVisible={false}
                items={this.menuItems}
            />
        );
    }
}
