// LICENSE : MIT
"use strict";
import * as React from "react";
import { AppStoreGroupState } from "../../store/AppStore";
import { GitHubSearchContainer } from "./GitHubSearchContainer/GitHubSearchContainer";
import { GitHubSearchStreamContainer } from "./GitHubSearchStreamContainer/GitHubSearchStreamContainer";
import { BaseContainer } from "./BaseContainer";
import IframeBrowser from "../project/IframeBrowser/IframeBrowser";

export class App extends BaseContainer<AppStoreGroupState, {}> {
    render() {
        const preview = process.env.RUNTIME_TARGET === "electron"
            ? <main className="App-preview">
                {/*<IframeBrowser html={"test"}/>*/}
            </main>
            : null;
        return <div className="App">
            <nav className="App-nav">
                <GitHubSearchContainer
                    gitHubSearchList={this.props.gitHubSearchList}/>
            </nav>
            <main className="App-main">
                <GitHubSearchStreamContainer
                    gitHubSearchStream={this.props.gitHubSearchStream}/>
            </main>
            {preview}
        </div>
    }
}
