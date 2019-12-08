const pattern = /@@Events@(.*?)$/;

export class GitHubReceivedEventsForUserQueryParameter {
    private query: string;
    public userName: string;

    constructor(query: string) {
        const match = query.match(pattern);
        if (!match) {
            throw new Error(`Invalid GitHubReceivedEventsForUserQueryParameter: ${query}

It does not match pattern: ${pattern.source}
`);
        }
        this.query = query;
        this.userName = match[1];
    }

    toJSON() {
        return {
            query: this.userName
        };
    }

    static fromJSON(
        json: ReturnType<typeof GitHubReceivedEventsForUserQueryParameter.prototype.toJSON>
    ) {
        return new GitHubReceivedEventsForUserQueryParameter(json.query);
    }

    toValue() {
        return this.query;
    }
}
