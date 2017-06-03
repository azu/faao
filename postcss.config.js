const browserList = "> 5%";
module.exports = {
    "plugins": {
        "postcss-easy-import": {},
        "postcss-custom-properties": {},
        "postcss-calc": {},
        "postcss-custom-media": {},
        "postcss-normalize": {
            "browsers": browserList
        },
        "autoprefixer": {
            "browsers": browserList
        },
        "postcss-reporter": {}
    }
};
