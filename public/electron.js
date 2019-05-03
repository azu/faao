// MIT © 2019 azu
"use strict";
require("ts-node").register({
    project: require("path").join(__dirname, "../tsconfig.electron.json")
});
require("../main-src/electron");
