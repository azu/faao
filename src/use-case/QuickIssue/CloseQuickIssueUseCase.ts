// MIT © 2017 azu
import { Payload, UseCase } from "almin";

export class CloseQuickIssueUseCasePayload extends Payload {
    type = "CloseQuickIssueUseCasePayload";
}

export class CloseQuickIssueUseCase extends UseCase {
    execute() {
        this.dispatch(new CloseQuickIssueUseCasePayload());
    }
}
