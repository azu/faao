// MIT © 2017 azu
// polyfill
import { createReloadAllStreamUseCase } from "./use-case/GitHubSearchStream/ReloadAllStreamUseCase";
// index
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Context, Dispatcher } from "almin";
import AlminReactContainer from "almin-react-container";
import { appStoreGroup, debuggable } from "./store/AppStoreGroup";
import { appLocator } from "./AppLocator";
import { AppContainer } from "./component/container/AppContainer";
import localForage from "localforage";
import { createSystemReadyToLaunchAppUseCase } from "./use-case/System/SystemReadyToLaunchAppUseCase";
import { runDOMBootstrap } from "./bootstrap/index";
import { AlminLogger } from "almin-logger";
import { initializeIcons } from "@uifabric/icons";

function allRequire(context: any) {
    context.keys().forEach(context);
}

allRequire((require as any).context("./", true, /\.css$/));

initializeIcons();
require("request-idle-polyfill");
// instances
const dispatcher = new Dispatcher();
// context connect dispatch with stores
const context = new Context({
    dispatcher,
    store: appStoreGroup,
    options: {
        strict: true,
        performanceProfile: process.env.NODE_ENV !== "production"
    }
});
// setup localForage
localForage.config({
    name: "Faao"
});
if (process.env.NODE_ENV !== "production") {
    (window as any)["alminContext"] = context;
    const logger = new AlminLogger();
    logger.startLogging(context);
    // enable debug mode
    debuggable();
}
// set context to a single object.
appLocator.context = context;
// initialize
runDOMBootstrap();
// start render
const AppWrapContainer = AlminReactContainer.create(AppContainer, context);
ReactDOM.render(<AppWrapContainer />, document.getElementById("js-app"), async () => {
    // render and restore repositories
    await context
        .useCase(createSystemReadyToLaunchAppUseCase())
        .executor(useCase => useCase.execute());
    // reload all stream at first
    await context.useCase(createReloadAllStreamUseCase()).executor(useCase => useCase.execute());
});
