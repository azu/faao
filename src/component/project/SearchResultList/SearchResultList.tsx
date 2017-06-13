// MIT © 2017 azu
import * as React from "react";
import { List } from "office-ui-fabric-react";
import { SyntheticEvent } from "react";
import { GitHubSearchResultItem } from "../../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";

import classnames from "classnames";
import {
    GitHubSearchStreamStateItem,
    IconType
} from "../../../store/GitHubSearchStreamStore/GitHubSearchStreamStateItem";

const {
    CommentIcon,
    IssueOpenedIcon,
    IssueClosedIcon,
    GitMergeIcon,
    GitPullRequestIcon
} = require("react-octicons");
const suitcssClassnames = require("suitcss-classnames");

export interface SearchResultListItemProps {
    isActive: boolean;
    item: GitHubSearchStreamStateItem;
    onClickItem: (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => void;
}

function getColorByBgColor(bgColor: string) {
    return parseInt(bgColor.replace("#", ""), 16) > 0xffffff / 2 ? "#000" : "#fff";
}

export const createIcon = (iconType: IconType, color: string) => {
    const style = {
        fill: color
    };
    switch (iconType) {
        case "IssueOpenedIcon":
            return <IssueOpenedIcon style={style} />;
        case "IssueClosedIcon":
            return <IssueClosedIcon style={style} />;
        case "GitPullRequestIcon":
            return <GitPullRequestIcon style={style} />;
        case "GitMergeIcon":
            return <GitMergeIcon style={style} />;
    }
};

export class SearchResultListItem extends React.Component<SearchResultListItemProps, {}> {
    render() {
        const onClick = (event: SyntheticEvent<any>) => {
            this.props.onClickItem(event, this.props.item);
        };
        const item = this.props.item;
        const labels = item.labels.map(label => {
            const style = {
                color: getColorByBgColor(label.color),
                backgroundColor: `#${label.color}`
            };
            return (
                <span key={label.name} className="SearchResultListItem-label" style={style}>
                    {label.name}
                </span>
            );
        });

        const className = suitcssClassnames({
            component: "SearchResultListItem",
            states: {
                "is-active": this.props.isActive
            }
        });

        const icon = createIcon(item.iconType, item.iconColor);
        return (
            <div className={className} onClick={onClick}>
                <span className="SearchResultListItem-primaryText">
                    <a className="SearchResultListItem-link" href={item.htmlUrl}>
                        {icon} {item.title}
                    </a>
                </span>
                <span className="SearchResultListItem-tertiaryText">{item.body}</span>
                <div className="SearchResultListItem-labels">{labels}</div>
                <footer className="SearchResultListItem-footer">
                    <span className="SearchResultListItem-issueNumber">
                        {item.shortPath}#{item.number}
                    </span>
                    <span> updated </span>
                    <span className="SearchResultListItem-updateDate">
                        {item.formattedUpdatedDateString}
                    </span>
                    <span> by </span>
                    <span className="SearchResultListItem-author">
                        <img
                            src={item.user.avatarUrl}
                            className="SearchResultListItem-authorIcon"
                            title={item.user.htmlUrl}
                        />
                        {item.user.login}
                    </span>
                    <div className="SearchResultListItem-meta">
                        <span className="SearchResultListItem-comments">
                            <CommentIcon className="SearchResultListItem-commentsIcon" />
                            <span className="SearchResultListItem-commentsCount">
                                {item.comments}
                            </span>
                        </span>
                    </div>
                </footer>
            </div>
        );
    }
}

export interface SearchResultListProps {
    className?: string;
    items: GitHubSearchStreamStateItem[];
    activeItem?: GitHubSearchResultItem;
    onClickItem: (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => void;
}

export class SearchResultList extends React.Component<SearchResultListProps, {}> {
    private _list: List;
    state: {
        selectedIndex: number;
    };

    constructor() {
        super();
        this.state = {
            selectedIndex: 0
        };
    }

    componentWillReceiveProps(nextProps: SearchResultListProps) {
        const itemIndex = nextProps.items.findIndex(item => {
            return item.equals(nextProps.activeItem);
        });
        if (itemIndex !== -1) {
            this._scroll(itemIndex, nextProps.items);
        }
    }

    render() {
        const onClickItem = (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => {
            this.props.onClickItem(event, item);
        };
        return (
            <List
                data-is-scrollable="true"
                ref={(c: List) => {
                    this._list = c;
                }}
                className={classnames("SearchResultList", this.props.className)}
                items={this.props.items}
                renderedWindowsBehind={10}
                renderedWindowsAhead={10}
                onRenderCell={item => {
                    return (
                        <SearchResultListItem
                            item={item}
                            isActive={item.equals(this.props.activeItem)}
                            onClickItem={onClickItem}
                        />
                    );
                }}
            />
        );
    }

    private _scroll(index: number, items: GitHubSearchResultItem[]) {
        const updatedSelectedIndex = Math.min(Math.max(index, 0), items.length - 1);
        this.setState(
            {
                selectedIndex: updatedSelectedIndex
            },
            () => {
                this._list.forceUpdate();
                const activeElement = document.querySelector(
                    `.ms-List-cell[data-list-index='${index}']`
                );
                if (activeElement) {
                    activeElement.scrollIntoView();
                }
            }
        );
    }
}
