// MIT © 2017 azu
import { createStubContext } from "../../../test/AlminUseCaseStub";
import { ShowErrorNoticeUseCase } from "../ShowErrorNoticeUseCase";
import { NoticeRepository } from "../../../infra/repository/NoticeRepository";
import * as TypeMoq from "typemoq";

describe("ShowErrorNoticeUseCase", () => {
    xit("should save error notice to repository", () => {
        const { context } = createStubContext(ShowErrorNoticeUseCase);
        const noticeRepository = new NoticeRepository();
        const notice = TypeMoq.It.isAny();
        return context
            .useCase(new ShowErrorNoticeUseCase(noticeRepository))
            .execute(notice)
            .then(() => {
                expect(noticeRepository.get()).toBe(notice);
            });
    });
});
