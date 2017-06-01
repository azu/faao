# Faao

Faao is a GitHub issue client like jasper.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install

## Usage

- [ ] Write usage instructions

## Development

### How to pronounce "Faao"?

Same with [How to say "faao"! (High Quality Voices) - YouTube](https://www.youtube.com/watch?v=m4BPcZeOBpw "How to say &#34;faao&#34;! (High Quality Voices) - YouTube")

### Structure

#### Internal Data

- GitHubSetting
    - `id`*1
    - Token
    - API Host - Primary key
    - Web Host

#### Search List

Save/read the search list to gist.

- GitHubQuery
    - Name
    - Query(`q`)
    - Color
    - API Host <- get from `id`*1

#### Search Result

- GitHubSearchStream
    - GitHubSearchResult
        - GitHubSearchResultItem
        - Wrap of <https://developer.github.com/v3/search/#search-issues>

#### Action to Search Result

- Action to GitHubSearchStream
    - Reload
    - Force Reload(Reset and Load)
- Action to GitHubSearchResultItem
    - Open URL
    - 

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

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
