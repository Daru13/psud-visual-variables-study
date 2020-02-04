import { View } from "./View";
import { EventManager } from "../events/EventManager";
import { SuccesEvent } from "../events/SuccesEvent";

interface ViewParameter {vv: number, oc: number};

enum State { Init, Test, Check };

export class TrialView extends View<ViewParameter> {
    private parameters: ViewParameter;
    private state: State;

    beforeRender(parameters: ViewParameter): void {
        this.node = $("<div>").attr("id", "trial-view");
        this.parameters = parameters;
        this.setInitPanel();
    }

    render(): void {
        $("body").append(this.node);
    }

    destroy(): void {
        this.node.remove();
    }

    private setInitPanel() {
        this.state = State.Init;

        $("<p>").text("You will be presented multiple objects. Only one looks different than the others. You will have to press SPACE as soon as you got it.")
        .appendTo(this.node);

        $("<p>").text("Press ENTER when ready.")
            .appendTo(this.node);

        let onEnter = (e: any) => {
            if (e.key === "Enter") {
                $("body").off("keyup", onEnter);
                this.node.children().remove();
                this.setTestPanel();
            }
        };

        $("body").on("keyup", onEnter);
    }

    private setTestPanel() {
        this.state = State.Test;

        let temp = 2;
        let vv = 1;
        let grid = $('<div>').addClass("test-state");
        let n: number;

        switch(temp) {
            case 1:
                grid.addClass("low");
                n = 9;
                break;
            case 2:
                grid.addClass("medium");
                n = 16;
                break;
            case 3:
                grid.addClass("high");
                n = 25;
                break;
        }

        switch(vv){
            case 1:
                grid.addClass("hue");
                break;
        }

        let differentTargetIndex = Math.floor(Math.random() * n);

        for(let i = 0; i < n; i++){
            $('<div>')
                .addClass((i === differentTargetIndex)? "cell target" : "cell")
                .appendTo(grid);
        }
        
        let startTime: number;

        let onSpace = (e: any) => {
            if (e.key === " ") {
                $("body").off("keyup", onSpace);
                this.setCheckPanel(Date.now() - startTime);
            }
        };
        $("body").on("keyup", onSpace);

        this.node.append(grid);
        startTime = Date.now();
    }

    private setCheckPanel(duration: number) {
        this.state = State.Check;
        this.node
            .find(".test-state")
            .removeClass("test-state")
            .addClass("check-state");
        
        let onClick = (event: any) => {
            if ($(event.target).hasClass("target")) {
                EventManager.emit(new SuccesEvent(duration));
                console.log(duration);
                this.node
                    .find(".cell")
                    .off("click", onClick);
            } else {
                this.node.children().remove();
                this.setInitPanel();
            }
        };

        this.node
            .find(".cell")
            .on("click", onClick);
    }
}