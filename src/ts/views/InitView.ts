import "jquery";
import { View } from "./View";
import { SetupCompletionEvent } from "../events/SetupCompletionEvent";
import { EventManager } from "../events/EventManager";

interface ViewParameter { participantsNb: number };

export class InitView extends View<ViewParameter> {
    beforeRender(parameters: ViewParameter): void {
        this.node = $("<div>").attr("id", "init-view");
        
        $("<p>").text("Welcome!").appendTo(this.node);
        
        let inputNode = $("<div>").appendTo(this.node);

        $("<label>")
            .attr("for", "user-id-input")
            .text("User ID: ")
            .appendTo(inputNode);

        let userIdInput = $("<input>")
            .attr("id", "user-id-input")
            .attr("type", "number")
            .attr("min", "1")
            .attr("max", parameters.participantsNb.toString())
            .appendTo(inputNode);

        $("<button>")
            .attr("id", "submit-user-id-button")
            .text("Submit")
            .on("click", () => {
                console.log(userIdInput.val());
                EventManager.emit(new SetupCompletionEvent(parseInt(userIdInput.val() as string)));
            })
            .appendTo(this.node);
    }

    render(): void {
        $("body").append(this.node);
    }

    destroy(): void {
        this.node.remove();
    }
}