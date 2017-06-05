# Faao

Faao is a GitHub issue client like jasper.

[![gif](https://media.giphy.com/media/l4FGxHRrgC1bv6OeQ/giphy.gif)](https://giphy.com/gifs/l4FGxHRrgC1bv6OeQ/fullscreen)

## Install

Install with [npm](https://www.npmjs.com/):

    npm install

## Usage

- [ ] Write usage instructions

## Development

### How to pronounce "Faao"?

Same with [How to say "faao"! (High Quality Voices) - YouTube](https://www.youtube.com/watch?v=m4BPcZeOBpw "How to say &#34;faao&#34;! (High Quality Voices) - YouTube")

### Structure

Reation

- settings
- queries


#### User

- User select settions
- User open stream
- User select item
- User open item with browser

#### GitHub Settings

- GitHubSetting
    - `id`*1
    - Token
    - API Host - Primary key
    - Web Host

Q. Why not User?
A. GitHub create difference token for a single user.
User is not unique.


#### Search List

Save/read the search list to gist.

- GitHubQuery
    - Name
    - Query(`q`)
    - Color
    - gitHubSettingId *1
        - API Host
        - Token
        - ...

#### Search Result

- GitHubSearchStream
    - GitHubSearchResult
        - GitHubSearchResultItem
        - Wrap of <https://developer.github.com/v3/search/#search-issues>

Stream can combine the other stream.

#### Action to Search Result

- Action to GitHubSearchStream
    - Reload
    - Force Reload(Reset and Load)
- Action to GitHubSearchResultItem
    - Open URL


## Changelog

See [Releases page](https://github.com/azu/faao/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/faao/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Related Efforts

- [azu/github-issue-teev](https://github.com/azu/github-issue-teev): [NW.js] GitHub Issue Manager(Viewer)
- [Jasper](https://jasperapp.io/): A flexible and powerful issue reader for GitHub
- [Gitscout](https://gitscout.com/ "Gitscout | A beautiful and optimized GitHub Issues experience for macOS"): A beautiful and optimized GitHub Issues experience for macOS

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
