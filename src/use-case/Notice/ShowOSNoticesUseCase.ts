// MIT © 2017 azu
import { UseCase } from "almin";
import { NoticeRepository, noticeRepository } from "../../infra/repository/NoticeRepository";
import { OSNotice } from "../../domain/Notice/OSNotice";

export const createShowOSNoticesUseCase = () => {
    return new ShowOSNoticesUseCase(noticeRepository);
};

export class ShowOSNoticesUseCase extends UseCase {
    constructor(public noticeRepository: NoticeRepository) {
        super();
    }

    execute(notices: OSNotice[]) {
        notices.forEach(notice => {
            this.noticeRepository.save(notice);
        });
    }
}
