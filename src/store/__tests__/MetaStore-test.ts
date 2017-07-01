// MIT © 2017 azu
import * as glob from "glob";
import * as path from "path";
import { createStoreMap } from "../AppStoreGroup";

const storeDir = path.join(__dirname, "../");
const storeFiles = glob.sync(path.join(storeDir, "**/*Store.ts"));
const storeNames = storeFiles.map(file => {
    return path.basename(file, ".ts");
});
/**
 * Excluding store name
 */
const excludeStoreNames = [
    "BaseStore" // Example
];
/**
 * Store meta test
 */
describe("MetaStore", () => {
    // 実際にAppStoreGroupに登録されているStore一覧
    const actualRegisteredStores = Object.values(createStoreMap());
    const actualRegisteredStoreTuple = actualRegisteredStores.map(store => {
        return {
            name: store.constructor.name,
            store
        };
    });
    const targetStores = actualRegisteredStoreTuple.filter(({ name }) => {
        return !excludeStoreNames.includes(name);
    });
    storeNames.forEach(storeName => {
        describe(storeName, () => {
            it(`should be registered in AppStoreGroup`, () => {
                const isIncluded = targetStores.some(({ name }) => {
                    return name === storeName;
                });
                if (!isIncluded) {
                    throw new Error(`Should register to AppStoreGroup. Store: ${storeName}`);
                }
            });
            it("should return state that is not undefined", () => {
                const targetStoreTuple = targetStores.find(({ name }) => {
                    return name === storeName;
                });
                expect(targetStoreTuple!.store.getState).not.toBeUndefined();
            });
        });
    });
});
