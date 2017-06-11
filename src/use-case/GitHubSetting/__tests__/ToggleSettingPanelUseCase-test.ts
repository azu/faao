// MIT © 2017 azu
import { createStubContext } from "../../../test/AlminUseCaseStub";
import {
    CloseSettingPanelUseCase,
    CloseSettingPanelUseCasePayload,
    OpenSettingPanelUseCase,
    OpenSettingPanelUseCasePayload
} from "../ToggleSettingPanelUseCase";
import { GitHubSettingFactory } from "../../../domain/GitHubSetting/GitHubSettingsFactory";

describe("ToggleSettingPanelUseCase", () => {
    describe("OpenSettingPanelUseCase", () => {
        it("should dispatch OpenSettingPanelUseCasePayload", () => {
            const { dispatchedPayloads, context } = createStubContext(OpenSettingPanelUseCase);
            return context
                .useCase(new OpenSettingPanelUseCase())
                .executor(useCase => useCase.execute())
                .then(() => {
                    expect(dispatchedPayloads[0]).toBeInstanceOf(OpenSettingPanelUseCasePayload);
                });
        });
        it("can execute with exist setting", () => {
            const { dispatchedPayloads, context } = createStubContext(OpenSettingPanelUseCase);
            const setting = GitHubSettingFactory.create();
            return context
                .useCase(new OpenSettingPanelUseCase())
                .executor(useCase => useCase.execute(setting))
                .then(() => {
                    const payload: OpenSettingPanelUseCasePayload = dispatchedPayloads[0];
                    expect(payload).toBeInstanceOf(OpenSettingPanelUseCasePayload);
                    expect(payload.setting).toBe(setting);
                });
        });
    });
    describe("CloseSettingPanelUseCase", () => {
        it("should dispatch CloseSettingPanelUseCasePayload", () => {
            const { dispatchedPayloads, context } = createStubContext(CloseSettingPanelUseCase);
            return context
                .useCase(new CloseSettingPanelUseCase())
                .executor(useCase => useCase.execute())
                .then(() => {
                    expect(dispatchedPayloads[0]).toBeInstanceOf(CloseSettingPanelUseCasePayload);
                });
        });
    });
});
