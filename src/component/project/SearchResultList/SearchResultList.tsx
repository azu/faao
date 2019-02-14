// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import { List } from "office-ui-fabric-react";
import { GitHubSearchResultItem } from "../../../domain/GitHubSearchStream/GitHubSearchResultItem";

import classnames from "classnames";
import {
    GitHubSearchStreamStateItem,
    IconType
} from "../../../store/GitHubSearchStreamStore/GitHubSearchStreamStateItem";

// save file-size
const CommentIcon = require("react-octicons/lib/comment").default;
const IssueOpenedIcon = require("react-octicons/lib/issue-opened").default;
const IssueClosedIcon = require("react-octicons/lib/issue-closed").default;
const GitMergeIcon = require("react-octicons/lib/git-merge").default;
const GitPullRequestIcon = require("react-octicons/lib/git-pull-request").default;

const suitcssClassnames = require("suitcss-classnames");

export interface SearchResultListItemProps {
    isActive: boolean;
    item: GitHubSearchStreamStateItem;
    index?: number;
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
                "is-active": this.props.isActive,
                "is-unread": !this.props.item.isRead
            }
        });

        const icon = createIcon(item.iconType, item.iconColor);
        return (
            <div
                className={className}
                onClick={onClick}
                tabIndex={-1}
                data-searchresultitem-index={this.props.index}
            >
                <span className="SearchResultListItem-primaryText">
                    <a className="SearchResultListItem-link" href={item.html_url}>
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
                            src={item.user.avatar_url}
                            className="SearchResultListItem-authorIcon"
                            title={item.user.html_url}
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
    private _list!: List;
    state: {
        selectedIndex: number;
    };

    constructor(args: SearchResultListProps) {
        super(args);
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
                onRenderCell={(item, index) => {
                    return (
                        <SearchResultListItem
                            item={item}
                            isActive={item.equals(this.props.activeItem)}
                            onClickItem={onClickItem}
                            index={index}
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
                    `[data-searchresultitem-index='${index}']`
                );
                if (activeElement) {
                    activeElement.scrollIntoView();
                }
            }
        );
    }
}
