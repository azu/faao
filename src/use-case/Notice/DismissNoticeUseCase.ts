// MIT © 2017 azu
import { UseCase } from "almin";
import { Notice } from "../../domain/Notice/Notice";
import { NoticeRepository, noticeRepository } from "../../infra/repository/NoticeRepository";

export const createDismissNoticeUseCase = () => {
    return new DismissNoticeUseCase(noticeRepository);
};

export class DismissNoticeUseCase extends UseCase {
    constructor(public noticeRepository: NoticeRepository) {
        super();
    }

    execute(notice: Notice) {
        this.noticeRepository.delete(notice);
    }
}
