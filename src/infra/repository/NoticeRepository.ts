// MIT © 2017 azu
// MIT © 2017 azu
import { NullableBaseRepository } from "./NullableBaseRepository";
import { Notice } from "../../domain/Notice/Notice";

export class NoticeRepository extends NullableBaseRepository<Notice> {}
export const noticeRepository = new NoticeRepository();
