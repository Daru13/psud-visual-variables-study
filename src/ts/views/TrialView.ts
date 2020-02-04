import { View } from "./View";

interface ViewParameter {vv: number, oc: number};

export class TrialView extends View<ViewParameter> {
    beforeRender(parameters: ViewParameter): void {

    }

    render(): void {
        throw new Error("Method not implemented.");
    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }


}