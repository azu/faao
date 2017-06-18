// MIT © 2017 azu
import { Payload, UseCase } from "almin";

export class OpenMobileMenuUseCasePayload extends Payload {
    constructor() {
        super({ type: "OpenMobileMenuUseCasePayload" });
    }
}

export class OpenMobileMenuUseCase extends UseCase {
    execute() {
        this.dispatch(new OpenMobileMenuUseCasePayload());
    }
}

export class CloseMobileMenuUseCasePayload extends Payload {
    constructor() {
        super({ type: "CloseMobileMenuUseCasePayload" });
    }
}

export class CloseMobileMenuUseCase extends UseCase {
    execute() {
        this.dispatch(new CloseMobileMenuUseCasePayload());
    }
}
