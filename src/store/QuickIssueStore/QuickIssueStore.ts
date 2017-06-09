// MIT © 2017 azu
import { Payload, Store } from "almin";
import { GitHubSearchListRepository } from "../../infra/repository/GitHubSearchListRepository";
import { AppRepository } from "../../infra/repository/AppRepository";
import { GitHubSettingRepository } from "../../infra/repository/GitHubSettingsRepository";
import urlJoin from "url-join";
import { OpenQuickIssueUseCasePayload } from "../../use-case/QuickIssue/OpenQuickIssueUseCase";
import { CloseQuickIssueUseCasePayload } from "../../use-case/QuickIssue/CloseQuickIssueUseCase";
import uniqBy from "lodash.uniqby";
import { EntityId } from "../../domain/util/EntityId";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { shallowEqual } from "shallow-equal-object";

export interface QuickIssueStateObject {
    isOpened: boolean;
    newIssueURLs: string[];
}

export class QuickIssueState implements QuickIssueStateObject {
    isOpened: boolean;
    newIssueURLs: string[];

    constructor(args: QuickIssueStateObject) {
        this.newIssueURLs = args.newIssueURLs;
        this.isOpened = args.isOpened;
    }

    update(newIssueURLs: string[]) {
        return new QuickIssueState({
            ...this as QuickIssueStateObject,
            newIssueURLs
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
            newIssueURLs: [],
            isOpened: false
        });
    }

    shouldStateUpdate(prevState: QuickIssueState, nextState: QuickIssueState): boolean {
        if (shallowEqual(prevState, nextState)) {
            return false;
        }
        if (!prevState || !nextState) {
            return true;
        }
        return shallowEqual(prevState.newIssueURLs, nextState.newIssueURLs);
    }

    async receivePayload(payload: Payload) {
        const app = this.repositories.appRepository.get();
        const activeItem = app.user.activity.activeItem;
        const activeQuery = app.user.activity.activeQuery;
        const gitHubSearchList = this.repositories.gitHubSearchListRepository.get();
        const queries = gitHubSearchList.queries;
        const settings = await this.repositories.gitHubSettingRepository.findAll();
        const getSetting = (id: EntityId<GitHubSetting>): GitHubSetting | undefined => {
            return settings.find(setting => setting.id === id);
        };
        // create issue list
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
        if (activeItem && activeQuery) {
            // TODO: Move to domain
            // http://:host/:repo/issues/new
            const gitHubSetting = getSetting(activeQuery.gitHubSettingId);
            if (!gitHubSetting) {
                return;
            }
            // api-host/repos/ -> web-host/
            const webHost = activeItem.repositoryUrl.replace(
                urlJoin(gitHubSetting.apiHost, "repos"),
                gitHubSetting.webHost
            );
            const newIssueURL = urlJoin(webHost, "issues/new");
            newIssueURLs.unshift(newIssueURL);
        }
        const newState = this.state.update(uniqBy(newIssueURLs, x => x)).reduce(payload);
        this.setState(newState);
    }

    getState(): QuickIssueState {
        return this.state;
    }
}
