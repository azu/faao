// MIT © 2017 azu
import { Payload, Store } from "almin";
import { GitHubSearchListRepository } from "../../infra/repository/GitHubSearchListRepository";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import urlJoin from "url-join";
import { OpenQuickIssueUseCasePayload } from "../../use-case/QuickIssue/OpenQuickIssueUseCase";
import { CloseQuickIssueUseCasePayload } from "../../use-case/QuickIssue/CloseQuickIssueUseCase";
import uniqBy from "lodash.uniqby";
import { EntityId } from "../../domain/Entity";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchResultItem } from "../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchResultItem";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";

export interface QuickIssueStateObject {
    isOpened: boolean;
    gitHubSearchLists: GitHubSearchList[];
    settings: GitHubSetting[];
    activeItem?: GitHubSearchResultItem;
    activeQuery?: GitHubSearchQuery;
}

export class QuickIssueState implements QuickIssueStateObject {
    gitHubSearchLists: GitHubSearchList[];
    settings: GitHubSetting[];
    activeItem?: GitHubSearchResultItem;
    activeQuery?: GitHubSearchQuery;
    isOpened: boolean;

    constructor(args: QuickIssueStateObject) {
        this.gitHubSearchLists = args.gitHubSearchLists;
        this.settings = args.settings;
        this.activeItem = args.activeItem;
        this.activeQuery = args.activeQuery;
        this.isOpened = args.isOpened;
    }

    get newIssueURLs(): string[] {
        const getSetting = (id: EntityId<GitHubSetting>): GitHubSetting | undefined => {
            return this.settings.find(setting => setting.id.equals(id));
        };
        // create issue list
        let queries: GitHubSearchQuery[] = [];
        this.gitHubSearchLists.forEach(searchList => {
            queries = queries.concat(searchList.queries);
        });
        const newIssueURLs = queries
            .map(query => {
                const gitHubSetting = getSetting(query.gitHubSettingId);
                if (!gitHubSetting) {
                    return [];
                }
                return query.targetRepositories.map(repository => {
                    // http://:host/:repo/issues/new
                    return urlJoin(gitHubSetting.webHost, repository, "issues/new");
                });
            })
            .reduce((compute, repo) => {
                return compute.concat(repo);
            }, []);
        if (this.activeItem && this.activeQuery) {
            // http://:host/:repo/issues/new
            const gitHubSetting = getSetting(this.activeQuery.gitHubSettingId);
            if (gitHubSetting) {
                // api-host/repos/ -> web-host/
                const webHost = this.activeItem.repositoryUrl.replace(
                    urlJoin(gitHubSetting.apiHost, "repos"),
                    gitHubSetting.webHost
                );
                const newIssueURL = urlJoin(webHost, "issues/new");
                newIssueURLs.unshift(newIssueURL);
            }
        }
        return uniqBy(newIssueURLs, x => x);
    }

    update(object: Partial<QuickIssueStateObject>) {
        // prevent update when open panel is not opened
        if (!this.isOpened) {
            return this;
        }
        return new QuickIssueState({
            ...this as QuickIssueStateObject,
            ...object
        });
    }

    reduce(payload: OpenQuickIssueUseCasePayload | CloseQuickIssueUseCasePayload) {
        if (payload instanceof OpenQuickIssueUseCasePayload) {
            return new QuickIssueState({
                ...this as QuickIssueStateObject,
                isOpened: true
            });
        } else if (payload instanceof CloseQuickIssueUseCasePayload) {
            return new QuickIssueState({
                ...this as QuickIssueStateObject,
                isOpened: false
            });
        }
        return this;
    }
}

export interface QuickIssueStoreArgs {
    appRepository: AppRepository;
    gitHubSearchListRepository: GitHubSearchListRepository;
    gitHubSettingRepository: GitHubSettingRepository;
}

export class QuickIssueStore extends Store<QuickIssueState> {
    state: QuickIssueState;

    constructor(public repositories: QuickIssueStoreArgs) {
        super();
        this.state = new QuickIssueState({
            gitHubSearchLists: [],
            settings: [],
            isOpened: false
        });
    }

    async receivePayload(payload: Payload) {
        const app = this.repositories.appRepository.get();
        const activeItem = app.user.activity.activeItem;
        const activeQuery = app.user.activity.activeQuery;
        const gitHubSearchLists = this.repositories.gitHubSearchListRepository.findAll();
        const resolvedRepository = await this.repositories.gitHubSettingRepository.ready();
        const settings = resolvedRepository.findAll();
        this.setState(
            this.state.reduce(payload).update({
                gitHubSearchLists,
                settings,
                activeItem,
                activeQuery
            })
        );
    }

    getState(): QuickIssueState {
        return this.state;
    }
}
