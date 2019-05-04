// MIT © 2017 azu
import { UseCase } from "almin";
import { Notice } from "../../domain/Notice/Notice";
import { NoticeRepository, noticeRepository } from "../../infra/repository/NoticeRepository";

export const createDismissNoticesUseCase = () => {
    return new DismissNoticesUseCase(noticeRepository);
};

export class DismissNoticesUseCase extends UseCase {
    constructor(public noticeRepository: NoticeRepository) {
        super();
    }

    execute(notices: Notice[]) {
        notices.forEach(notice => {
            this.noticeRepository.delete(notice);
        });
    }
}
