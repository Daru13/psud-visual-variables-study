import "jquery";
import { View } from "./View";
import { NewUserEvent } from "../events/NewUserEvent";
import { EventManager } from "../events/EventManager";

interface ViewParameter { };

export class InitView extends View<ViewParameter> {
    beforeRender(): void {
        this.node = $("<div>").attr("id", "initial-view");
        
        $("<p>").text("Welcome!").appendTo(this.node);
        
        $("<label>")
            .attr("for", "user-id-input")
            .text("User ID")
            .appendTo(this.node);

        let userIdInput = $("<input>")
            .attr("id", "user-id-input")
            .attr("type", "number")
            .appendTo(this.node);

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