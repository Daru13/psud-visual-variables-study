import { View } from "./View";
import { EventManager } from "../events/EventManager";
import { PauseTimeoutEvent } from "../events/PauseTimeoutEvent";

interface ViewParameter { };

export class PauseView extends View<ViewParameter> {
    private static readonly PAUSE_DURATION: number = 5;
    private timer: number;

    beforeRender(): void {
        this.node = $("<div>").attr("id", "pause-view");

        $("<p>").text("Break!").appendTo(this.node);

        $("<p>").attr("id", "timer-display").appendTo(this.node);
    }

    render(): void {
        $("body").append(this.node);

        let second = PauseView.PAUSE_DURATION;
        let timerDisplay = $("#timer-display");

        let setTimer = () => {
            if (second > 0) {
                timerDisplay.text(second);
                this.timer = window.setTimeout(setTimer, 1000);
                console.log(second);
            } else {
                EventManager.emit(new PauseTimeoutEvent());
                console.log("Pause end");
            }
            second -= 1;
        };
        setTimer();
    }

    destroy(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
        this.node.remove();
    }
}