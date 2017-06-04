// MIT © 2017 azu
import * as React from "react";
import { ContextualMenu, DefaultButton, DirectionalHint, IconButton, Link, List } from "office-ui-fabric-react";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { SyntheticEvent } from "react";

export interface SearchQueryListItemProps {
    query: GitHubSearchQuery;
    onClickQuery: (event: SyntheticEvent<any>, query: GitHubSearchQuery) => void;
}

export interface SearchQueryListItemState {
    contextTarget?: EventTarget;
    isContextMenuVisible: boolean;
}

export class SearchQueryListItem extends React.Component<SearchQueryListItemProps, SearchQueryListItemState> {
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
            borderLeft: `${this.props.query.color.hexCode} 2px solid`,
            paddingLeft: "0.5em"
        };
        const contextMenu = this.state.contextTarget && this.state.isContextMenuVisible
            ? <ContextualMenu
                shouldFocusOnMount={ true }
                target={ this.state.contextTarget }
                directionalHint={ DirectionalHint.rightBottomEdge }
                onDismiss={() => {
                    this.setState({ contextTarget: undefined, isContextMenuVisible: false })
                }}
                items={
                    [
                        {
                            key: 'newItem',
                            iconProps: {
                                iconName: 'Add'
                            },
                            subMenuProps: {
                                items: [
                                    {
                                        key: 'emailMessage',
                                        name: 'Email message',
                                        title: 'Create an email'
                                    },
                                    {
                                        key: 'calendarEvent',
                                        name: 'Calendar event',
                                        title: 'Create a calendar event',
                                    }
                                ],
                            },
                            name: 'New'
                        }
                    ]
                }
            />
            : null;
        return <div className="SearchQueryListItem">
            {contextMenu}
            <Link className='SearchQueryListItem-button' onClick={onClick}>
                <span style={style} className='SearchQueryListItem-primaryText'>{ this.props.query.name }</span>
            </Link>

            <IconButton
                className="SearchQueryListItem-settingButton"
                iconProps={ { iconName: 'Settings' } }
                title='Open Context Menu'
                ariaLabel='Open Context Menu'
                text={ "More" }
                onClick={this.onClickOpenContextMenu}
            />

        </div>
    }
}

export interface SearchQueryListProps {
    queries: GitHubSearchQuery[];
    onClickQuery: (event: SyntheticEvent<any>, query: GitHubSearchQuery) => void;
}

export class SearchQueryList extends React.Component<SearchQueryListProps, {}> {
    render() {
        const onClickQuery = (event: SyntheticEvent<any>, query: GitHubSearchQuery) => {
            this.props.onClickQuery(event, query);
        };
        return <List
            getPageHeight={() => 30}
            className="SearchQueryList"
            items={ this.props.queries }
            onRenderCell={ (query: GitHubSearchQuery) => (
                <SearchQueryListItem query={query} onClickQuery={onClickQuery}/>
            )}
        />
    }
}