"use strict";
if (!!process.env.FAAO_URL) {
    require("ts-node").register({
        project: require("path").join(__dirname, "../tsconfig.electron.json")
    });
    require("../main-src/electron");
} else {
    require("./main-src/electron");
}
