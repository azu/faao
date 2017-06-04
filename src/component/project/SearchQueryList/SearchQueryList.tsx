// MIT © 2017 azu
import * as React from "react";
import { Link, List } from "office-ui-fabric-react";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
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
        const style = {
            borderLeft: `${this.props.query.color.hexCode} 2px solid`,
            paddingLeft: "0.5em"
        };
        return <div className="SearchQueryListItem">
            <Link className='SearchQueryListItem-button' onClick={onClick}>
                <span style={style} className='SearchQueryListItem-primaryText'>{ this.props.query.name }</span>
            </Link>
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