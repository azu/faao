// MIT © 2017 azu
import { Payload, UseCase } from "almin";

export class OpenQuickIssueUseCasePayload extends Payload {
    constructor() {
        super({
            type: "OpenQuickIssueUseCasePayload"
        });
    }
}

export class OpenQuickIssueUseCase extends UseCase {
    execute() {
        this.dispatch(new OpenQuickIssueUseCasePayload);
    }
}