// MIT © 2017 azu
import { Payload, UseCase } from "almin";

export class OpenProfileWindowUseCasePayload extends Payload {
    constructor() {
        super({ type: "OpenProfileWindowUseCase" });
    }
}

export class OpenProfileWindowUseCase extends UseCase {
    execute() {
        this.dispatch(new OpenProfileWindowUseCasePayload());
    }
}

export class CloseProfileWindowUseCasePayload extends Payload {
    constructor() {
        super({ type: "CloseProfileWindowUseCasePayload" });
    }
}

export class CloseProfileWindowUseCase extends UseCase {
    execute() {
        this.dispatch(new CloseProfileWindowUseCasePayload());
    }
}
