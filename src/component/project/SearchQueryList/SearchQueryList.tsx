// MIT © 2017 azu
import * as React from "react";
import { ContextualMenu, DirectionalHint, IconButton, Link, List } from "office-ui-fabric-react";
import { GitHubSearchQuery } from "../../../domain/GitHubSearchList/queries/GitHubSearchQuery";
import { GitHubSearchList } from "../../../domain/GitHubSearchList/GitHubSearchList";
import { shallowEqual } from "shallow-equal-object";
import { UnionQuery } from "../../../domain/GitHubSearchList/queries/QueryRole";

const suitcssClassnames = require("suitcss-classnames");

export interface SearchQueryListItemProps {
    query: GitHubSearchQuery;
    isActive: boolean;
    onClickQuery: (query: GitHubSearchQuery) => void;
    onEditQuery: (query: GitHubSearchQuery) => void;
    onDeleteQuery: (query: GitHubSearchQuery) => void;
}

export interface SearchQueryListItemState {
    contextTarget?: EventTarget;
    isContextMenuVisible: boolean;
}

export class SearchQueryListItem extends React.Component<
    SearchQueryListItemProps,
    SearchQueryListItemState
> {
    state = {
        contextTarget: undefined,
        isContextMenuVisible: false
    };

    onClickOpenContextMenu = (event: React.MouseEvent<any>) => {
        this.setState({ contextTarget: event.target, isContextMenuVisible: true });
    };

    render() {
        const onClick = () => {
            this.props.onClickQuery(this.props.query);
        };
        const style = {
            borderLeft: `${this.props.query.color.hexCode} 3px solid`,
            paddingLeft: "0.5em"
        };
        const contextMenu =
            this.state.contextTarget && this.state.isContextMenuVisible ? (
                <ContextualMenu
                    shouldFocusOnMount={true}
                    target={this.state.contextTarget}
                    directionalHint={DirectionalHint.rightBottomEdge}
                    onDismiss={() => {
                        this.setState({
                            contextTarget: undefined,
                            isContextMenuVisible: false
                        });
                    }}
                    items={[
                        {
                            key: "edit-query",
                            iconProps: {
                                iconName: "Edit"
                            },
                            onClick: (
                                event?:
                                    | React.MouseEvent<HTMLElement>
                                    | React.KeyboardEvent<HTMLElement>
                            ) => {
                                if (!event) {
                                    return;
                                }
                                this.props.onEditQuery(this.props.query);
                            },
                            name: "Edit query"
                        },
                        {
                            key: "delete-query",
                            iconProps: {
                                iconName: "Delete"
                            },
                            onClick: (
                                event?:
                                    | React.MouseEvent<HTMLElement>
                                    | React.KeyboardEvent<HTMLElement>
                            ) => {
                                if (!event) {
                                    return;
                                }
                                if (confirm(`Does delete "${this.props.query.name}"?`)) {
                                    this.props.onDeleteQuery(this.props.query);
                                }
                            },
                            name: "Delete query"
                        }
                    ]}
                />
            ) : null;

        const className = suitcssClassnames({
            component: "SearchQueryListItem",
            states: {
                "is-active": this.props.isActive
            }
        });
        return (
            <div className={className}>
                {contextMenu}
                <Link style={style} className="SearchQueryListItem-button" onClick={onClick}>
                    <span className="SearchQueryListItem-primaryText">{this.props.query.name}</span>
                </Link>

                <IconButton
                    className="SearchQueryListItem-settingButton"
                    iconProps={{ iconName: "Settings" }}
                    title="Open Context Menu"
                    ariaLabel="Open Context Menu"
                    text={"More"}
                    onClick={this.onClickOpenContextMenu}
                />
            </div>
        );
    }
}

export interface SearchQueryListProps {
    searchList: GitHubSearchList;
    activeQuery?: UnionQuery;
    activeSearchList?: GitHubSearchList;
    onClickSearchList: (searchList: GitHubSearchList) => void;
    onClickAddingGitHubQuery: (searchList: GitHubSearchList) => void;
    onClickAddingFaaoQuery: (searchList: GitHubSearchList) => void;
    onClickQuery: (query: GitHubSearchQuery) => void;
    onEditQuery: (query: GitHubSearchQuery) => void;
    onDeleteQuery: (query: GitHubSearchQuery) => void;
}

export class SearchQueryList extends React.Component<SearchQueryListProps, {}> {
    private list?: List;

    componentWillReceiveProps(nextProps: SearchQueryListProps) {
        if (!shallowEqual(this.props, nextProps)) {
            if (this.list) {
                // TODO: We want to get more efficient way
                // update list with active query change
                this.list.forceUpdate();
            }
        }
    }

    render() {
        const isActiveSearchList = this.props.activeSearchList === this.props.searchList;
        const className = suitcssClassnames({
            component: "SearchQueryList",
            states: {
                "is-active": isActiveSearchList
            }
        });
        return (
            <div className={className}>
                <header className="SearchQueryList-header">
                    <h1 className="ms-font-xxl SearchQueryList-headerTitle">
                        <Link className="SearchQueryList-headerLink" onClick={this.onClick}>
                            {this.props.searchList.name}
                        </Link>
                        <IconButton
                            data-automation-id="add-query"
                            disabled={false}
                            checked={false}
                            iconProps={{ iconName: "Add" }}
                            menuProps={{
                                items: [
                                    {
                                        key: "github-query",
                                        text: "Add GitHub query",
                                        iconProps: { iconName: "Add" },
                                        onClick: this.onClickAddingGitHubQuery
                                    },
                                    {
                                        key: "faao-query",
                                        text: "Add Faao query",
                                        iconProps: { iconName: "Add" },
                                        onClick: this.onClickAddingFaaoQuery
                                    }
                                ]
                            }}
                        />
                    </h1>
                </header>
                <List
                    ref={(c: List) => (this.list = c)}
                    className="SearchQueryList"
                    items={this.props.searchList.queries}
                    onRenderCell={(query: GitHubSearchQuery) => (
                        <SearchQueryListItem
                            query={query}
                            isActive={query.equals(this.props.activeQuery)}
                            onClickQuery={this.props.onClickQuery}
                            onEditQuery={this.props.onEditQuery}
                            onDeleteQuery={this.props.onDeleteQuery}
                        />
                    )}
                />
            </div>
        );
    }

    onClick = () => {
        this.props.onClickSearchList(this.props.searchList);
    };

    onClickAddingGitHubQuery = () => {
        this.props.onClickAddingGitHubQuery(this.props.searchList);
    };

    onClickAddingFaaoQuery = () => {
        this.props.onClickAddingFaaoQuery(this.props.searchList);
    };
}
