// MIT © 2017 azu
"use strict";
import { UseCase } from "almin";
import { OpenItemInNewTabUseCase } from "../App/OpenItemInNewTabUseCase";

export class OpenGitHubIssueUseCase extends UseCase {
    execute(issueURL: string, title: string = "", body: string = "") {
        const issueURLFilled = `${issueURL}?title=${title}&body=${body}`;
        return this.context.useCase(new OpenItemInNewTabUseCase()).execute(issueURLFilled);
    }
}