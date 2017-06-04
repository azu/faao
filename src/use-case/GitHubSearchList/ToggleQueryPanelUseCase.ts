// MIT © 2017 azu
import { Payload, UseCase } from "almin";

export class OpenQueryPanelUseCasePayload extends Payload {
    constructor() {
        super({ type: "OpenQueryPanelUseCasePayload" })
    }
}

export class CloseQueryPanelUseCasePayload extends Payload {
    constructor() {
        super({ type: "CloseQueryPanelUseCasePayload" })
    }
}

export class OpenQueryPanelUseCase extends UseCase {
    execute() {
        this.dispatch(new OpenQueryPanelUseCasePayload());
    }
}

export class CloseQueryPanelUseCase extends UseCase {
    execute() {
        this.dispatch(new CloseQueryPanelUseCasePayload());
    }
}