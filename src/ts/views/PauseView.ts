import { View } from "./View";
import { EventManager } from "../events/EventManager";
import { SetupCompletion } from "../events/PauseTimeoutEvent";

interface ViewParameter { };

export class PauseView extends View<ViewParameter> {
    private static readonly PAUSE_DURATION: number = 5000;
    private timer: number;

    beforeRender(): void {
        this.node = $("<div>").attr("id", "pause-view");

        $("<p>").text("Break!").appendTo(this.node);
    }

    render(): void {
        $("body").append(this.node);
        this.timer = window.setTimeout(() => {
            EventManager.emit(new SetupCompletion());
            console.log("Pause end");
        }, PauseView.PAUSE_DURATION);
    }

    destroy(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
        this.node.remove();
    }
}