export class TimeScheduler {
    private timerId?: any;

    constructor(private callback: () => void, private interval: number) {}

    private idleWork = () => {
        this.callback();
    };

    start(): void {
        this.timerId = setInterval(this.idleWork, this.interval);
    }

    stop(): void {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = undefined;
        }
    }
}
