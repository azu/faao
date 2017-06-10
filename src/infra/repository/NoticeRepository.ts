// MIT © 2017 azu
import { NullableBaseRepository } from "./NullableBaseRepository";
import { Notice } from "../../domain/Notice/Notice";

export class NoticeRepository extends NullableBaseRepository<Notice> {
    // TODO: FIXME correct
    // https://github.com/Microsoft/TypeScript/issues/7657
    // https://github.com/Microsoft/TypeScript/pull/10916
    findAllByType<T extends Notice, S extends T>(
        predicate: (((notice: T) => boolean) | ((notice: T) => notice is S))
    ): S[] {
        return this.map.values().filter(entity => {
            console.log(entity);
            console.log(predicate(entity as T));
            return predicate(entity as T);
        }) as S[];
    }
}

export const noticeRepository = new NoticeRepository();
