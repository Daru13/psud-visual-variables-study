import "jquery";

/**
 * An abstract class to create views.
 */
export abstract class View<P extends object> {
    node: JQuery;
    /**
     * Instantiate the view based on parameters.
     * @param parameters View parameters.
     */
    abstract beforeRender(parameters: P): void
    /**
     * Renders the view.
     */
    abstract render(): void

    /**
     * Destroys view.
     */
    abstract destroy(): void
}