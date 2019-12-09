import { Identifier } from "../../Entity";

export type GitHubActiveItemJSON = {
    id: string;
    html_url: string;
    repository_html_url: string;
};

export interface GitHubActiveItemArgs {
    id: Identifier<GitHubActiveItem>;
    html_url: string;
    repository_html_url: string;
}

export const isGitHubActiveItem = (item: any): item is GitHubActiveItem => {
    return item instanceof GitHubActiveItem;
};
export class GitHubActiveItem {
    id: Identifier<GitHubActiveItem>;
    html_url: string;
    repository_html_url: string;

    constructor(args: GitHubActiveItemArgs) {
        this.id = args.id;
        this.html_url = args.html_url;
        this.repository_html_url = args.repository_html_url;
    }

    static fromJSON(json: GitHubActiveItemJSON) {
        return new GitHubActiveItem({
            ...json,
            id: new Identifier(json.id)
        });
    }

    toJSON(): GitHubActiveItemJSON {
        return {
            id: this.id.toValue(),
            html_url: this.html_url,
            repository_html_url: this.repository_html_url
        };
    }
}
