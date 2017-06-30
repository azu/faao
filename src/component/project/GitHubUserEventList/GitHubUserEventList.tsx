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
                "is-active": this.props.isActive
            }
        });

        return (
            <div className={className} onClick={onClick}>
                <span className="GitHubUserEventListItem-primaryText">
                    {item.description}
                </span>
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
    activeItem?: GitHubUserActivityEvent;
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
            return item.equals(nextProps.activeItem);
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
                            isActive={item.equals(this.props.activeItem)}
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
