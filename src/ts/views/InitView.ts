import "jquery";
import { View } from "./View";
import { NewUserEvent } from "../events/SetupCompletionEvent";
import { EventManager } from "../events/EventManager";

interface ViewParameter { };

export class InitView extends View<ViewParameter> {
    beforeRender(): void {
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
            .appendTo(inputNode);

        $("<button>")
            .attr("id", "submit-user-id-button")
            .text("Submit")
            .on("click", () => {
                console.log(userIdInput.val());
                EventManager.emit(new NewUserEvent(userIdInput.val() as number));
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