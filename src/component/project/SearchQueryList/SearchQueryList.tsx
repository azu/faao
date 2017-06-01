// MIT © 2017 azu
import * as React from "react";
import { List } from "office-ui-fabric-react";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchQuery";
import { SyntheticEvent } from "react";

export interface SearchQueryListItemProps {
    query: GitHubSearchQuery;
    onClickQuery: (event: SyntheticEvent<any>, query: GitHubSearchQuery) => void;
}

export class SearchQueryListItem extends React.Component<SearchQueryListItemProps, {}> {
    render() {
        const onClick = (event: SyntheticEvent<any>) => {
            this.props.onClickQuery(event, this.props.query);
        };
        return <div className='ms-ListItem SearchQueryListItem' onClick={onClick}>
            <span className='ms-ListItem-primaryText'>{ this.props.query.name }</span>
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
            className="SearchQueryList"
            items={ this.props.queries }
            onRenderCell={ (query: GitHubSearchQuery) => (
                <SearchQueryListItem query={query} onClickQuery={onClickQuery}/>
            )}
        />
    }
}