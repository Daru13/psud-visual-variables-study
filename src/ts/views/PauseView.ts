import { View } from "./View";
import { EventManager } from "../events/EventManager";
import { PauseEndEvent } from "../events/PauseEndEvent";

export class PauseView extends View<null> {
    private static readonly PAUSE_DURATION: number = 5000;
    private timer: number;

    beforeRender(): void {
        this.node = $("<div>").attr("id", "pause-view");

        $("<p>").text("Break!").appendTo(this.node);
    }

    render(): void {
        $("body").append(this.node);
        this.timer = window.setTimeout(() => {
            EventManager.emit(new PauseEndEvent());
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