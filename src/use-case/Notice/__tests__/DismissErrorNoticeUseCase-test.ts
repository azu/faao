// MIT © 2017 azu
import { createStubContext } from "../../../test/AlminUseCaseStub";
import { NoticeRepository } from "../../../infra/repository/NoticeRepository";
import * as TypeMoq from "typemoq";
import { DismissNoticeUseCase } from "../DismissNoticeUseCase";
import { SearchQueryErrorNotice } from "../../../domain/Notice/SearchQueryErrorNotice";

const noticeRepository = new NoticeRepository();
const notice = new SearchQueryErrorNotice({
    query: TypeMoq.It.isAny(),
    error: new Error("error")
});
describe("DismissNoticeUseCase", () => {
    beforeEach(() => {
        noticeRepository.save(notice);
    });
    afterEach(() => {
        noticeRepository.clear();
    });
    it("should save error notice to repository", () => {
        const { context } = createStubContext(DismissNoticeUseCase);
        const noticeRepository = new NoticeRepository();
        return context
            .useCase(new DismissNoticeUseCase(noticeRepository))
            .execute(notice)
            .then(() => {
                expect(noticeRepository.findById(notice.id)).toBeUndefined();
            });
    });
});
