// MIT © 2017 azu
import { UseCase } from "almin";
import { NoticeRepository, noticeRepository } from "../../infra/repository/NoticeRepository";
import { isOSNotice } from "../../domain/Notice/OSNotice";
import { AppRepository, appRepository } from "../../infra/repository/AppRepository";

const debug = require("debug")("faao:MarkOSNoticesAsShownUseCase");
export const createMarkOSNoticesAsShownUseCase = () => {
    return new MarkOSNoticesAsShownUseCase(appRepository, noticeRepository);
};

export class MarkOSNoticesAsShownUseCase extends UseCase {
    constructor(private appRepository: AppRepository, private noticeRepository: NoticeRepository) {
        super();
    }

    execute(readTimeStamp: number) {
        const app = this.appRepository.get();
        const osNotices = this.noticeRepository.findAllByType(notice => {
            return isOSNotice(notice);
        });
        const deleteNotices = osNotices.filter(notice => {
            return notice.timeStamp <= readTimeStamp;
        });
        debug("Delete osNotices: %d", deleteNotices.length);
        deleteNotices.forEach(notice => {
            this.noticeRepository.delete(notice);
        });
        // update activity
        app.user.seeNotificationAtTime(readTimeStamp);
        this.appRepository.save(app);
    }
}
