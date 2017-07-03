# Domain

## App

`App` is Faao application.
Usually, `App` is one.

### AppUser

- AppUser select settings
- AppUser open stream
- AppUser select item
- AppUser open item with browser

## GitHubSetting

- GitHubSetting
    - `id`*1
    - Token
    - API Host
    - Web Host
    - `<relation>` gitHubUserId

Q. Why not User?
A. GitHub create difference token for a single user.
User is not unique.

## SearchList

SearchList is a collection of queries.

- SearchList has queries
- GitHubQuery
    - Name
    - Query(`q`)
    - Color
    - `<relation>` gitHubSettingId *1
        - API Host
        - Token
        - ...

## Search Result

- GitHubSearchStream
    - GitHubSearchResult
        - GitHubSearchResultItem
        - Wrap of <https://developer.github.com/v3/search/#search-issues>

Stream can combine the other stream.

## Action to Search Result

- Action to GitHubSearchStream
    - Reload
    - Force Reload(Reset and Load)
- Action to GitHubSearchResultItem
    - Open URL

## GitHubUser

GitHubUser is difference with AppUser.

- GitHubUser has activity that has events.

### GitHubUserActivity

- has events
- https://developer.github.com/v3/activity/events/
- Activity is LRU

## Notice

Notice is a notification.

Create custom notice for each errors/notification.

## Profile

Profile is a collection of personal setting.
