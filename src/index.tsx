// MIT © 2017 azu
"use strict";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./component/container/App";
import { Context, Dispatcher } from "almin";
import AlminReactContainer from "almin-react-container";
import { AppStoreGroup } from "./store/AppStore";
import { appLocator } from "./AppLocator";

const AlminLogger = require("almin-logger");
// instances
const dispatcher = new Dispatcher();
// context connect dispatch with stores
const context = new Context({
    dispatcher,
    store: AppStoreGroup.create()
});
if (process.env.NODE_ENV !== "production") {
    // start logger
    const logger = new AlminLogger();
    logger.startLogging(context);
}
// set context to a single object.
appLocator.context = context;
// start render
const AppContainer = AlminReactContainer.create<AppStoreGroup>(App, context);
ReactDOM.render(<AppContainer />, document.getElementById("js-app"));