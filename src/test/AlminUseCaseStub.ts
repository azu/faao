import { Context, Dispatcher, DispatcherPayloadMeta, Payload, Store, UseCase } from "almin";

export class MockState {}

export class MockStore extends Store<MockState> {
    state: MockState;

    constructor() {
        super();
        this.state = new MockState();
    }

    getState() {
        return this.state;
    }
}

export interface MockUseCaseExecuted {
    useCase: UseCase;
    args: Array<any>;
}

export interface Constructor<T> {
    new (...args: any[]): T;

    prototype: T;
}

/**
 * create stub context for `UseCaseConstructor`
 * If you want to stub of child useCase executing result, specify `executor` function.
 */
export function createStubContext(
    UseCaseConstructor: Constructor<UseCase>,
    executor?: (useCase: UseCase, ...args: Array<any>) => any
) {
    const context = new Context({
        store: new MockStore(),
        dispatcher: new Dispatcher()
    });
    /**
     * executed child UseCase
     */
    const executedUseCases: MockUseCaseExecuted[] = [];
    /**
     * dispatched payload
     */
    const dispatchedPayloads: Payload[] = [];
    context.onDispatch((payload, meta) => {
        if (meta.useCase instanceof UseCaseConstructor) {
            dispatchedPayloads.push(payload);
        }
    });
    // mock UseCase#execute
    const createMockUseCase = <T extends UseCase>(useCase: T): Pick<T, "execute"> => {
        return {
            execute(...args: Array<any>) {
                executedUseCases.push({
                    useCase,
                    args
                });
                if (useCase instanceof UseCaseConstructor) {
                    return useCase.execute(...args);
                } else if (typeof executor === "function") {
                    return executor(useCase, ...args);
                }
            }
        };
    };
    context.events.onWillExecuteEachUseCase((_payload, meta: DispatcherPayloadMeta) => {
        if (UseCase.isUseCase(meta.useCase)) {
            // stub useCase before execute
            (meta as any).useCase = createMockUseCase(meta.useCase);
        }
    });
    return {
        executedUseCases,
        dispatchedPayloads,
        context
    };
}
