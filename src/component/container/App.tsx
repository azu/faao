// LICENSE : MIT
"use strict";
import * as React from "react";
import { AppStoreGroupState } from "../../store/AppStore";
import { GitHubSearchContainer } from "./GitHubSearchContainer/GitHubSearchContainer";
import { GitHubSearchStreamContainer } from "./GitHubSearchStreamContainer/GitHubSearchContainer";
import { Grid } from "../ui-kit/Grid/Grid";
import GridCell from "../ui-kit/Grid/GridCell";
import { createSearchGitHubUseCase } from "../../use-case/GitHubSearchList/SearchGitHubUseCase";
import { BaseContainer } from "./BaseContainer";

export class App extends BaseContainer<AppStoreGroupState, {}> {
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
        return <div className="App">
            <nav className="App-nav">
                <GitHubSearchContainer
                    gitHubSearchList={this.props.gitHubSearchList}/>
            </nav>
            <main className="App-main">
                <GitHubSearchStreamContainer
                    gitHubSearchStream={this.props.gitHubSearchStream}/>
            </main>
        </div>
    }
}
