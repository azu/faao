// MIT © 2017 azu
import * as React from "react";
import { List } from "office-ui-fabric-react";
import { SyntheticEvent } from "react";
import { GitHubSearchResultItem } from "../../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";

import classnames from "classnames";

const { CommentIcon } = require("react-octicons-svg");

export interface SearchResultListItemProps {
    item: GitHubSearchResultItem;
    onClickItem: (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => void;
}

function getColorByBgColor(bgColor: string) {
    return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
}

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
            console.log(style)
            return <span className="SearchResultListItem-label" style={style}>{label.name}</span>
        })
        return <div className='SearchResultListItem' onClick={onClick}>
            <span className='SearchResultListItem-primaryText'>
                <a className='SearchResultListItem-link'
                   href={item.htmlUrl}>
                { item.title }
                </a>
            </span>
            <span className='SearchResultListItem-tertiaryText'>{ item.body }</span>
            <div className="SearchResultListItem-labels">{labels}</div>
            <footer className="SearchResultListItem-footer">
                <span className="SearchResultListItem-issueNumber">#{item.number}</span>
                <span> updated </span>
                <span className='SearchResultListItem-updateDate'>{item.updatedAt}</span>
                <span> by </span>
                <span className="SearchResultListItem-author"><img
                    src={item.user.avatarUrl}
                    className="SearchResultListItem-authorIcon"
                    title={item.user.htmlUrl}/>{item.user.login}</span>
                <div className="SearchResultListItem-meta">
                    <span className="SearchResultListItem-comments"><CommentIcon />{item.comments}</span>
                </div>
            </footer>
        </div>
    }
}

export interface SearchResultListProps {
    className?: string;
    items: GitHubSearchResultItem[];
    onClickItem: (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => void;
}

export class SearchResultList extends React.Component<SearchResultListProps, {}> {
    render() {
        const onClickItem = (event: SyntheticEvent<any>, item: GitHubSearchResultItem) => {
            this.props.onClickItem(event, item);
        };
        return <List
            className={classnames("SearchResultList", this.props.className)}
            items={ this.props.items }
            renderedWindowsAhead={5}
            onRenderCell={ (item: GitHubSearchResultItem) => (
                <SearchResultListItem item={item} onClickItem={onClickItem}/>
            )}
        />
    }
}
