// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import {
    ContextualMenuItemType,
    DirectionalHint,
    IconButton,
    IContextualMenuItem,
    List
} from "office-ui-fabric-react";
import { GitHubSearchResultItem } from "../../../domain/GitHubSearchStream/GitHubSearchResultItem";
import classnames from "classnames";
import {
    GitHubSearchStreamStateItem,
    IconType
} from "../../../store/GitHubSearchStreamStore/GitHubSearchStreamStateItem";
import { FaaoSearchQuery } from "../../../domain/GitHubSearchList/queries/FaaoSearchQuery";
import { GitHubActiveItem } from "../../../domain/App/Activity/GitHubActiveItem";

const removeMarkdown = require("@azu/remove-markdown");

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
    faaoQueries: FaaoSearchQuery[];
    onClickItem: (event: SyntheticEvent<any>, item: GitHubSearchStreamStateItem) => void;
    onClickQueryOptionMenu: (item: GitHubSearchStreamStateItem, query: FaaoSearchQuery) => void;
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

const QueryButton = (props: {
    item: GitHubSearchStreamStateItem;
    faaoQueries: FaaoSearchQuery[];
    onClickQuery(query: FaaoSearchQuery): void;
    onCliclDumpItem(): void;
}) => {
    const queryHeaders: IContextualMenuItem[] = [
        {
            key: "Add item to Query",
            itemType: ContextualMenuItemType.Header,
            text: "Add item to Query"
        }
    ];
    const queryItems: IContextualMenuItem[] = props.faaoQueries.map(query => {
        return {
            key: query.name,
            text: query.name,
            iconProps: {
                iconName: query.includesParameterURL(props.item.html_url)
                    ? "CheckboxComposite"
                    : "Checkbox"
            },
            onClick: () => {
                props.onClickQuery(query);
            }
        };
    });

    const debugHeaders: IContextualMenuItem[] = [
        {
            key: "Debug Menu",
            itemType: ContextualMenuItemType.Header,
            text: "Debug Menu"
        }
    ];
    const debugItems: IContextualMenuItem[] = [
        {
            key: "dump item",
            text: "Dump item",
            iconProps: {
                iconName: "ConstructionCone"
            },
            onClick: () => {
                props.onCliclDumpItem();
            }
        }
    ];

    const items =
        process.env.REACT_APP === "test"
            ? queryHeaders.concat(queryHeaders, queryItems)
            : queryHeaders.concat(queryItems, debugHeaders, debugItems);
    return (
        <IconButton
            disabled={props.faaoQueries.length === 0}
            checked={false}
            size={14}
            menuProps={{
                ariaLabel: "Query Option Menu",
                directionalHint: DirectionalHint.bottomCenter,
                items: items
            }}
        />
    );
};

export class SearchResultListItem extends React.Component<SearchResultListItemProps, {}> {
    private onClick = (event: SyntheticEvent<any>) => {
        this.props.onClickItem(event, this.props.item);
    };
    private onClickQueryOptionMenu = (query: FaaoSearchQuery) => {
        this.props.onClickQueryOptionMenu(this.props.item, query);
    };

    render() {
        const onClick = this.onClick;
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
                <span className="SearchResultListItem-tertiaryText">
                    {removeMarkdown(item.body).trim()}
                </span>
                <div className="SearchResultListItem-nonContent">
                    <aside className={"SearchResultListItem-sideMenu"}>
                        <QueryButton
                            item={item}
                            faaoQueries={this.props.faaoQueries}
                            onClickQuery={this.onClickQueryOptionMenu}
                            onCliclDumpItem={() => {
                                console.log(item);
                            }}
                        />
                    </aside>
                    <footer className={"SearchResultListItem-footer"}>
                        <div className="SearchResultListItem-labels">{labels}</div>
                        <div className="SearchResultListItem-meta">
                            <span className="SearchResultListItem-author">
                                <img
                                    src={item.avatarUrl}
                                    className="SearchResultListItem-authorIcon"
                                    alt={item.userName}
                                />
                            </span>
                            <span className="SearchResultListItem-issueNumber">
                                <a href={item.html_url}>{item.shortPath}</a>
                            </span>
                            <span className="SearchResultListItem-updateDate">
                                {item.formattedUpdatedDateString}
                            </span>
                            {item.comments !== undefined ? (
                                <span className="SearchResultListItem-comments">
                                    <CommentIcon className="SearchResultListItem-commentsIcon" />
                                    <span className="SearchResultListItem-commentsCount">
                                        {item.comments}
                                    </span>
                                </span>
                            ) : null}
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export interface SearchResultListProps {
    className?: string;
    items: GitHubSearchStreamStateItem[];
    faaoQueries: FaaoSearchQuery[];
    activeItem?: GitHubActiveItem;
    onClickItem: (event: SyntheticEvent<any>, item: GitHubSearchStreamStateItem) => void;
    onClickQueryOptionMenu: (item: GitHubSearchStreamStateItem, query: FaaoSearchQuery) => void;
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

    private onClickItem = (event: SyntheticEvent<any>, item: GitHubSearchStreamStateItem) => {
        this.props.onClickItem(event, item);
    };

    private onClick = (event: SyntheticEvent<any>, item: GitHubSearchStreamStateItem) => {
        this.props.onClickItem(event, item);
    };

    private onClickQueryOptionMenu = (
        item: GitHubSearchStreamStateItem,
        query: FaaoSearchQuery
    ) => {
        this.props.onClickQueryOptionMenu(item, query);
    };

    render() {
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
                            onClickItem={this.onClickItem}
                            index={index}
                            faaoQueries={this.props.faaoQueries}
                            onClickQueryOptionMenu={this.props.onClickQueryOptionMenu}
                        />
                    );
                }}
            />
        );
    }

    private _scroll(index: number, items: GitHubSearchStreamStateItem[]) {
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
