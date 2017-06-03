export interface Owner {
    login: string;
    id: number;
    avatarUrl: string;
    gravatarId: string;
    url: string;
    htmlUrl: string;
    FollowersUrl: string;
    followingUrl: string;
    gistsUrl: string;
    starredUrl: string;
    subscriptionsUrl: string;
    organizationsUrl: string;
    reposUrl: string;
    eventsUrl: string;
    receivedEventsUrl: string;
    type: string;
    siteAdmin: boolean;
}


export interface User {
    login: string;
    id: number;
    avatarUrl: string;
    gravatarId: string;
    url: string;
    htmlUrl: string;
    followersUrl: string;
    followingUrl: string;
    gistsUrl: string;
    starredUrl: string;
    subscriptionsUrl: string;
    organizationsUrl: string;
    reposUrl: string;
    eventsUrl: string;
    receivedEventsUrl: string;
    type: string;
    siteAdmin: boolean;
}

export interface Label {
    id: number;
    url: string;
    name: string;
    color: string;
    default: boolean;
}

export interface Assignee {
    login: String;
    id: Number;
    avatarUrl: String;
    gravatarId: String;
    url: String;
    htmlUrl: String;
    followersUrl: String;
    followingUrl: String;
    gistsUrl: String;
    starredUrl: String;
    subscriptionsUrl: String;
    organizationsUrl: String;
    reposUrl: String;
    eventsUrl: String;
    receivedEventsUrl: String;
    type: String;
    siteAdmin: Boolean;
}

export interface Creator {
    login: string;
    id: Number;
    avatarUrl: string;
    gravatarId: string;
    url: string;
    htmlUrl: string;
    followersUrl: string;
    followingUrl: string;
    gistsUrl: string;
    starredUrl: string;
    subscriptionsUrl: string;
    organizationsUrl: string;
    reposUrl: string;
    eventsUrl: string;
    receivedEventsUrl: string;
    type: string;
    siteAdmin: boolean;
}

export interface Milestone {
    url: string;
    htmlUrl: string;
    labelsUrl: string;
    id: number;
    number: number;
    title: string;
    description: string;
    creator: Creator;
    openIssues: number;
    closedIssues: number;
    state: string;
    createdAt: string;
    updatedAt: string;
    dueOn: string;
    closedAt?: any;
}

export interface Repository {
    id: number;
    name: string;
    fullName: string;
    owner: Owner;
    private: boolean;
    htmlUrl: string;
    description: string;
    fork: boolean;
    url: string;
    forksUrl: string;
    keysUrl: string;
    collaboratorsUrl: string;
    teamsUrl: string;
    hooksUrl: string;
    issueEventsUrl: string;
    eventsUrl: string;
    assigneesUrl: string;
    branchesUrl: string;
    tagsUrl: string;
    blobsUrl: string;
    gitTagsUrl: string;
    gitRefsUrl: string;
    treesUrl: string;
    statusesUrl: string;
    languagesUrl: string;
    stargazersUrl: string;
    contributorsUrl: string;
    subscribersUrl: string;
    subscriptionUrl: string;
    commitsUrl: string;
    gitCommitsUrl: string;
    commentsUrl: string;
    issueCommentUrl: string;
    contentsUrl: string;
    compareUrl: string;
    mergesUrl: string;
    archiveUrl: string;
    downloadsUrl: string;
    issuesUrl: string;
    pullsUrl: string;
    milestonesUrl: string;
    notificationsUrl: string;
    labelsUrl: string;
}
// parse string
// camelCase
export interface Item {
    url: string;
    repositoryUrl: string;
    labelsUrl: string;
    commentsUrl: string;
    eventsUrl: string;
    htmlUrl: string;
    id: number;
    number: number;
    title: string;
    user: User;
    labels: Label[];
    state: string;
    locked: boolean;
    assignee: Assignee | null;
    assignees: Assignee[];
    milestone: Milestone | null;
    comments: number;
    createdAt: string;
    updatedAt: string;
    closedAt?: any;
    body: string;
    score: number;
}

export class GitHubSearchResultItem implements Item {
    url: string;
    repositoryUrl: string;
    labelsUrl: string;
    commentsUrl: string;
    eventsUrl: string;
    htmlUrl: string;
    id: number;
    number: number;
    title: string;
    user: User;
    labels: Label[];
    state: string;
    locked: boolean;
    assignee: Assignee | any;
    assignees: Assignee[];
    milestone: Milestone | any;
    comments: number;
    createdAt: string;
    updatedAt: string;
    body: string;
    score: number;

    constructor(item: Item) {
        Object.assign(this, item);
    }

    toJSON(): Item {
        return Object.assign({}, this);
    }
}