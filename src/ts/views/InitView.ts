import "jquery";
import { View } from "./View";
import { SetupCompletionEvent } from "../events/SetupCompletionEvent";
import { EventManager } from "../events/EventManager";

interface ViewParameter {
    nbParticipants: number;
};

export class InitView extends View<ViewParameter> {
    beforeRender(parameters: ViewParameter): void {
        this.node = $("<div>")
            .attr("id", "init-view");
        
        $("<h1>")
            .text("Welcome!")
            .appendTo(this.node);

        $("<p>")
            .text("Please input a participant ID to start the experiment.")
            .appendTo(this.node);
        
        let inputNode = $("<div>")
            .attr("id", "participant-id-form")
            .appendTo(this.node);

        let participantIDInput = $("<input>")
            .attr("id", "participant-id-input")
            .attr("type", "number")
            .attr("min", "1")
            .attr("max", parameters.nbParticipants.toString())
            .attr("placeholder", "ID")
            .prop("required", true)
            .appendTo(inputNode);

        $("<button>")
            .attr("id", "submit-participant-id-button")
            .text("Start")
            .on("click", () => {
                EventManager.emit(new SetupCompletionEvent(parseInt(participantIDInput.val() as string)));
            })
            .appendTo(inputNode);
    }

    render(): void {
        $("body")
            .append(this.node);
    }

    destroy(): void {
        this.node.remove();
    }
}