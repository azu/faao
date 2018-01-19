// MIT © 2017 azu
import { Payload, UseCase } from "almin";

export class OpenMobileMenuUseCasePayload extends Payload {
    type = "OpenMobileMenuUseCasePayload";
}

export class OpenMobileMenuUseCase extends UseCase {
    execute() {
        this.dispatch(new OpenMobileMenuUseCasePayload());
    }
}

export class CloseMobileMenuUseCasePayload extends Payload {
    type = "CloseMobileMenuUseCasePayload";
}

export class CloseMobileMenuUseCase extends UseCase {
    execute() {
        this.dispatch(new CloseMobileMenuUseCasePayload());
    }
}
