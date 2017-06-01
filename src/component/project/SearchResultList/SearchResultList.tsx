// MIT © 2017 azu
import * as React from "react";
import { List } from "office-ui-fabric-react";
import { SyntheticEvent } from "react";
import { GitHubSearchResultItem } from "../../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";

export interface SearchQueryListItemProps {
    item: GitHubSearchResultItem;
    onClickQuery: (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => void;
}

export class SearchQueryListItem extends React.Component<SearchQueryListItemProps, {}> {
    render() {
        const onClick = (event: SyntheticEvent<any>) => {
            this.props.onClickQuery(event, this.props.item);
        };
        return <div className='ms-ListItem SearchQueryListItem' onClick={onClick}>
            <a className='ms-ListItem-primaryText' href={this.props.item.html_url}>{ this.props.item.title }</a>
            <p>{this.props.item.body}</p>
        </div>
    }
}

export interface SearchQueryListProps {
    items: GitHubSearchResultItem[];
    onClickItem: (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => void;
}

export class SearchResultList extends React.Component<SearchQueryListProps, {}> {
    render() {
        const onClickQuery = (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => {
            this.props.onClickItem(event, item);
        };
        return <List
            className="SearchQueryList"
            items={ this.props.items }
            onRenderCell={ (item: GitHubSearchResultItem) => (
                <SearchQueryListItem item={item} onClickQuery={onClickQuery}/>
            )}
        />
    }
}