// MIT © 2017 azu
import * as React from "react";
import { ContextualMenu, DirectionalHint, IconButton, Link, List } from "office-ui-fabric-react";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { SyntheticEvent } from "react";
import { GitHubSearchList } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";
import { shallowEqual } from "shallow-equal-object";

const suitcssClassnames = require("suitcss-classnames");

export interface SearchQueryListItemProps {
    query: GitHubSearchQuery;
    isActive: boolean;
    onClickQuery: (event: SyntheticEvent<any>, query: GitHubSearchQuery) => void;
    onEditQuery: (event: SyntheticEvent<any>, query: GitHubSearchQuery) => void;
    onDeleteQuery: (event: SyntheticEvent<any>, query: GitHubSearchQuery) => void;
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
        const onClick = (event: SyntheticEvent<any>) => {
            this.props.onClickQuery(event, this.props.query);
        };
        const style = {
            borderLeft: `${this.props.query.color.hexCode} 3px solid`,
            paddingLeft: "0.5em"
        };
        const contextMenu = this.state.contextTarget && this.state.isContextMenuVisible
            ? <ContextualMenu
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
                          onClick: (event: React.MouseEvent<any>) => {
                              this.props.onEditQuery(event, this.props.query);
                          },
                          name: "Edit query"
                      },
                      {
                          key: "delete-query",
                          iconProps: {
                              iconName: "Delete"
                          },
                          onClick: (event: React.MouseEvent<any>) => {
                              if (confirm(`Does delete "${this.props.query.name}"?`)) {
                                  this.props.onDeleteQuery(event, this.props.query);
                              }
                          },
                          name: "Delete query"
                      }
                  ]}
              />
            : null;

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
                    <span className="SearchQueryListItem-primaryText">
                        {this.props.query.name}
                    </span>
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
    activeQuery?: GitHubSearchQuery;
    onClickSearchList: (event: SyntheticEvent<any>, searchList: GitHubSearchList) => void;
    onClickAddingQuery: (event: SyntheticEvent<any>, searchList: GitHubSearchList) => void;
    onClickQuery: (event: SyntheticEvent<any>, query: GitHubSearchQuery) => void;
    onEditQuery: (event: SyntheticEvent<any>, query: GitHubSearchQuery) => void;
    onDeleteQuery: (event: SyntheticEvent<any>, query: GitHubSearchQuery) => void;
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
        return (
            <div className="SearchQueryList">
                <header className="SearchQueryList-header">
                    <h1 className="ms-font-xxl SearchQueryList-headerTitle">
                        <Link className="SearchQueryList-headerLink" onClick={this.onClick}>
                            {this.props.searchList.name}
                        </Link>
                        <IconButton
                            className="SearchQueryList-addButton"
                            iconProps={{ iconName: "Add" }}
                            title="Add query"
                            ariaLabel="Add query"
                            onClick={this.onClickAddingQuery}
                        />
                    </h1>
                </header>
                <List
                    ref={(c: List) => (this.list = c)}
                    className="SearchQueryList"
                    items={this.props.searchList.queries}
                    getPageHeight={() => 32}
                    onRenderCell={(query: GitHubSearchQuery) =>
                        <SearchQueryListItem
                            query={query}
                            isActive={query.equals(this.props.activeQuery)}
                            onClickQuery={this.props.onClickQuery}
                            onEditQuery={this.props.onEditQuery}
                            onDeleteQuery={this.props.onDeleteQuery}
                        />}
                />
            </div>
        );
    }

    onClick = (event: SyntheticEvent<any>) => {
        this.props.onClickSearchList(event, this.props.searchList);
    };

    onClickAddingQuery = (event: SyntheticEvent<any>) => {
        this.props.onClickAddingQuery(event, this.props.searchList);
    };
}
