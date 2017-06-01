// LICENSE : MIT
"use strict";
import * as React from "react";
import { AppStoreGroupState } from "../../store/AppStore";
import { GitHubSearchContainer } from "./GitHubSearchContainer/GitHubSearchContainer";
import { GitHubSearchStreamContainer } from "./GitHubSearchStreamContainer/GitHubSearchContainer";

export class App extends React.Component<AppStoreGroupState, {}> {
    render() {
        console.log(this.props.gitHubSearchList);
        const searchList = this.props.gitHubSearchList.queries.map(query => {
            return <span key={`${query.name}-${query.apiHost}`} style={{
                color: query.color
            }}>{query.name}</span>
        });
        const searchStream = this.props.gitHubSearchStream.items.map(item => {
            return <span key={item.id}>{item.title}</span>
        });
        return <div>
            <GitHubSearchContainer gitHubSearchList={this.props.gitHubSearchList}/>
            <GitHubSearchStreamContainer gitHubSearchStream={this.props.gitHubSearchStream}/>
        </div>
    }
}
