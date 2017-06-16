// MIT © 2017 azu
import { UseCase } from "almin";
import { NoticeRepository, noticeRepository } from "../../infra/repository/NoticeRepository";
import { GenericErrorNotice } from "../../domain/Notice/GenericErrorNotice";

export const createShowGenericErrorUseCase = () => {
    return new ShowGenericErrorUseCase(noticeRepository);
};

export class ShowGenericErrorUseCase extends UseCase {
    constructor(public noticeRepository: NoticeRepository) {
        super();
    }

    execute(error: Error) {
        const notice = new GenericErrorNotice(error);
        this.noticeRepository.save(notice);
    }
}
