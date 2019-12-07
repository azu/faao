// MIT © 2017 azu
import { UseCase } from "almin";
import { Notice } from "../../domain/Notice/Notice";
import { NoticeRepository, noticeRepository } from "../../infra/repository/NoticeRepository";

export const createDismissNoticeUseCase = () => {
    return new DismissNoticeUseCase(noticeRepository);
};

export class DismissNoticeUseCase extends UseCase {
    private noticeRepository: NoticeRepository;

    constructor(noticeRepository: NoticeRepository) {
        super();
        this.noticeRepository = noticeRepository;
    }

    execute(notice: Notice) {
        this.noticeRepository.delete(notice);
    }
}
