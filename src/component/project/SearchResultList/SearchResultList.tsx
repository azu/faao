// MIT © 2017 azu
import * as React from "react";
import { List } from "office-ui-fabric-react";
import { SyntheticEvent } from "react";
import { GitHubSearchResultItem } from "../../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";

export interface SearchResultListItemProps {
    item: GitHubSearchResultItem;
    onClickItem: (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => void;
}

export class SearchResultListItem extends React.Component<SearchResultListItemProps, {}> {
    render() {
        const onClick = (event: SyntheticEvent<any>) => {
            this.props.onClickItem(event, this.props.item);
        };
        return <div className='SearchResultListItem' onClick={onClick}>
            <span className='SearchResultListItem-primaryText'>
                <a className='SearchResultListItem-link'
                   href={this.props.item.htmlUrl}>
                { this.props.item.title }
                </a>
            </span>
            <span className='SearchResultListItem-tertiaryText'>{ this.props.item.body }</span>
            <span className='SearchResultListItem-metaText'>{this.props.item.updatedAt}</span>
        </div>
    }
}

export interface SearchResultListProps {
    items: GitHubSearchResultItem[];
    onClickItem: (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => void;
}

export class SearchResultList extends React.Component<SearchResultListProps, {}> {
    render() {
        const onClickItem = (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => {
            this.props.onClickItem(event, item);
        };
        return <List
            className="SearchResultList"
            items={ this.props.items }
            renderedWindowsAhead={5}
            onRenderCell={ (item: GitHubSearchResultItem) => (
                <SearchResultListItem item={item} onClickItem={onClickItem}/>
            )}
        />
    }
}
