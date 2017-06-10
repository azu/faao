// MIT © 2017 azu
import { UseCase } from "almin";
import { Notice } from "../../domain/Notice/Notice";
import { NoticeRepository, noticeRepository } from "../../infra/repository/NoticeRepository";

export const createDismissErrorNoticeUseCase = () => {
    return new DismissErrorNoticeUseCase(noticeRepository);
};

export class DismissErrorNoticeUseCase extends UseCase {
    constructor(public noticeRepository: NoticeRepository) {
        super();
    }

    execute(notice: Notice) {
        this.noticeRepository.delete(notice);
    }
}
