import "jquery";

export abstract class View<P extends object> {
    node: JQuery;
    abstract beforeRender(parameters: P): void
    abstract render(): void
    abstract destroy(): void
}