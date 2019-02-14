# Faao [![Build Status](https://travis-ci.org/azu/faao.svg?branch=master)](https://travis-ci.org/azu/faao)

Faao is a GitHub Issue/Pull Request client on Electron/Browser.

[![gif](https://media.giphy.com/media/xUOrweo4UAStll4QP6/giphy.gif)](https://giphy.com/gifs/xUOrweo4UAStll4QP6/fullscreen)

## Feature

- Support Modern browser/mobile/Electron(recommenced)
- Support GitHub.com and GitHub Enterprise(GHE)
- Search Issue/Pull Request
    - [Search Syntax](https://help.github.com/articles/search-syntax/ "Search Syntax") is same with GitHub Search
- Mixed the result of search
    - e.g.) You can see the results of [Created](https://github.com/issues), [assigned](https://github.com/issues/assigned), [mentioned](https://github.com/issues/mentioned) as a single result
    - e.g.) You can see the results of `repo:azu/todo` on github.com and `repo:azu-ghe/todo` on GHE as a single result
- Support GitHub User Activity
- Quick to create issue
- Import/Export profile data
- [ ] Sync data between PCs/mobiles

## Usage

### Browser

- Open <https://azu.github.io/faao/>

### Electron

- [ ] Download binary

## Development

### Browser

    yarn start
    open http://localhost:8080/
    
### Electron

    yarn start
    yarn run electron

## How to pronounce "Faao"?

Same with [How to say "faao"! (High Quality Voices) - YouTube](https://www.youtube.com/watch?v=m4BPcZeOBpw "How to say &#34;faao&#34;! (High Quality Voices) - YouTube")

## Structure

### Domain

See [Domain documents](./docs/domain.md)

### UseCase

Visualization: [Faao - UseCase architecture](https://azu.github.io/faao/meta/use-case.html "Faao - UseCase architecture")

And See [UseCase documents](./docs/use-case.md)

## Changelog

See [Releases page](https://github.com/azu/faao/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

Run test files in `__tests__` directory by Jest.

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

with based on korat's ViewPool implementation.

- https://github.com/pocke/korat/blob/f6beb9eb625fa2927ab19e8316110189dd0b6ab0/src/mainProcess/ViewPool.ts