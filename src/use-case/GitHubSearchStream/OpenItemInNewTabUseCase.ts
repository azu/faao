// MIT © 2017 azu

import { UseCase } from "almin";

export class OpenItemInNewTabUseCase extends UseCase {
    execute(url: string) {
        window.open(url, "_faao");
    }
}