// MIT © 2017 azu
import * as React from "react";
import { SyntheticEvent } from "react";
import { List } from "office-ui-fabric-react";

import classnames from "classnames";
import { GitHubUserActivityEvent } from "../../../domain/GitHubUser/GitHubUserActivityEvent";
import { GitHubUserActivityEventVideoModel } from "../../../store/GitHubUserStore/GitHubUserStore";

const suitcssClassnames = require("suitcss-classnames");

export interface GitHubUserEventListItemProps {
    isActive: boolean;
    item: GitHubUserActivityEventVideoModel;
    onClickItem: (event: SyntheticEvent<any>, item: GitHubUserActivityEvent) => void;
}

export class GitHubUserEventListItem extends React.Component<GitHubUserEventListItemProps, {}> {
    render() {
        const onClick = (event: SyntheticEvent<any>) => {
            this.props.onClickItem(event, this.props.item);
        };
        const item = this.props.item;
        const className = suitcssClassnames({
            component: "GitHubUserEventListItem",
            states: {
                "is-active": this.props.isActive,
                "is-unread": !this.props.item.isRead
            }
        });
        const orgAvatar = <img src={item.repoAvatarUrl} width="18" height="18" />;
        return (
            <div className={className} onClick={onClick}>
                <header className="GitHubUserEventListItem-header">
                    <h1 className="GitHubUserEventListItem-title">
                        {orgAvatar}
                        <a href={item.htmlURL}>{item.shortPath}</a>
                    </h1>
                </header>
                <p className="GitHubUserEventListItem-body">
                    {item.description}
                </p>
                <footer className="GitHubUserEventListItem-footer">
                    <span> created </span>
                    <span className="GitHubUserEventListItem-updateDate">
                        {item.created_at}
                    </span>
                    <span> by </span>
                    <span className="GitHubUserEventListItem-author">
                        <img
                            src={item.actor.avatar_url}
                            className="GitHubUserEventListItem-authorIcon"
                            title={item.actor.url}
                            width="24"
                            height="24"
                        />
                        {item.actor.login}
                    </span>
                </footer>
            </div>
        );
    }
}

export interface GitHubUserEventListProps {
    className?: string;
    items: GitHubUserActivityEvent[];
    activeEvent?: GitHubUserActivityEvent;
    onClickItem: (event: SyntheticEvent<any>, item: GitHubUserActivityEvent) => void;
}

export class GitHubUserEventList extends React.Component<GitHubUserEventListProps, {}> {
    private _list: List;
    state: {
        selectedIndex: number;
    };

    constructor() {
        super();
        this.state = {
            selectedIndex: 0
        };
    }

    componentWillReceiveProps(nextProps: GitHubUserEventListProps) {
        const itemIndex = nextProps.items.findIndex(item => {
            return item.equals(nextProps.activeEvent);
        });
        if (itemIndex !== -1) {
            this._scroll(itemIndex, nextProps.items);
        }
    }

    render() {
        const onClickItem = (event: SyntheticEvent<any>, item: GitHubUserActivityEvent) => {
            this.props.onClickItem(event, item);
        };
        return (
            <List
                data-is-scrollable="true"
                ref={(c: List) => {
                    this._list = c;
                }}
                className={classnames("GitHubUserEventList", this.props.className)}
                items={this.props.items}
                renderedWindowsBehind={10}
                renderedWindowsAhead={10}
                onRenderCell={item => {
                    return (
                        <GitHubUserEventListItem
                            item={item}
                            isActive={item.equals(this.props.activeEvent)}
                            onClickItem={onClickItem}
                        />
                    );
                }}
            />
        );
    }

    private _scroll(index: number, items: GitHubUserActivityEvent[]) {
        const updatedSelectedIndex = Math.min(Math.max(index, 0), items.length - 1);
        this.setState(
            {
                selectedIndex: updatedSelectedIndex
            },
            () => {
                this._list.forceUpdate();
                const activeElement = document.querySelector(
                    `.ms-List-cell[data-list-index='${index}']`
                );
                if (activeElement) {
                    activeElement.scrollIntoView();
                }
            }
        );
    }
}
