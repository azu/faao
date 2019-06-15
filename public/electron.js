"use strict";
if (process.env.NODE_ENV === "development") {
    require("ts-node").register({
        project: require("path").join(__dirname, "../tsconfig.electron.json")
    });
    require("../main-src/electron");
} else {
    require("./main-src/electron");
}
