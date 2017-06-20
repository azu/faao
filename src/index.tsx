// MIT © 2017 azu

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Context, Dispatcher } from "almin";
import AlminReactContainer from "almin-react-container";
import { appStoreGroup, AppStoreGroupState, debuggable } from "./store/AppStoreGroup";
import { appLocator } from "./AppLocator";
import { AppContainer } from "./component/container/AppContainer";
import localForage from "localforage";
import { createReadyToAppUseCase } from "./use-case/App/ReadyToAppUseCase";
import { initializeElectron } from "./electron/index";
import isElectron from "is-electron";
import { initializeBrowser } from "./browser/index";

const AlminLogger = require("almin-logger");
// instances
const dispatcher = new Dispatcher();
// context connect dispatch with stores
const context = new Context({
    dispatcher,
    store: appStoreGroup
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
if (isElectron()) {
    initializeElectron();
} else {
    initializeBrowser();
}
// start render
const AppWrapContainer = AlminReactContainer.create<AppStoreGroupState>(AppContainer, context);
ReactDOM.render(<AppWrapContainer />, document.getElementById("js-app"), () => {
    // render and restore repositories
    context.useCase(createReadyToAppUseCase()).executor(useCase => useCase.execute());
});
