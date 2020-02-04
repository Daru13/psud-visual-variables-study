import { View } from "./View";
import { EventManager } from "../events/EventManager";
import { SuccesEvent } from "../events/SuccesEvent";
import { VisualVariable, ObjectCount } from "../Trial";

interface ViewParameter { visualVariable: VisualVariable, objectCount: ObjectCount};

export class TrialView extends View<ViewParameter> {
    private parameters: ViewParameter;

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
        let temp = 2;
        let vv = 1;
        let grid = $('<div>').addClass("test-state");
        let n: number;

        switch(this.parameters.objectCount) {
            case ObjectCount.Low:
                grid.addClass("low");
                n = 9;
                break;
            case ObjectCount.Medium:
                grid.addClass("medium");
                n = 16;
                break;
            case ObjectCount.High:
                grid.addClass("high");
                n = 25;
                break;
            case ObjectCount.Unknown:
                console.error("Object Count not known");
        }

        let differentTargetIndex = Math.floor(Math.random() * n);
        let colors = this.getColorList(n, differentTargetIndex);

        for(let i = 0; i < n; i++){
            $('<div>')
                .addClass((i === differentTargetIndex)? "cell target" : "cell")
                .addClass(colors[i])
                .appendTo(grid);
        }
        
        let startTime: number;

        let onSpace = (e: any) => {
            if (e.key === " ") {
                console.log("kdskfls")
                $("body").off("keyup", onSpace);
                this.setCheckPanel(Date.now() - startTime);
            }
        };
        $("body").on("keyup", onSpace);

        this.node.append(grid);
        startTime = Date.now();
    }

    private setCheckPanel(duration: number) {
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

    private getColorList(n: number, differentTargetIndex: number): string[] {
        let colors: string[] = [];
        let possibilities = [];
        switch (this.parameters.visualVariable) {
            case VisualVariable.Hue:
                possibilities.push("hue");
                possibilities.push("hue-alternate");
                break;
            case VisualVariable.Saturation:
                possibilities.push("saturation");
                possibilities.push("saturation-alternate");
                break;
            case VisualVariable.HueAndSaturation:
                possibilities.push("hue saturation");
                possibilities.push("hue-alternate saturation");
                possibilities.push("hue saturation-alternate");
                possibilities.push("hue-alternate saturation-alternate");
        }

        possibilities.sort(() => Math.random() - 0.5);

        let unique = possibilities.pop();
        let possibility;

        possibilities.forEach((possibility) => {
            colors.push(possibility);
            colors.push(possibility);
        })

        while (colors.length < n - 1) {
            possibility = possibilities[Math.floor(Math.random() * possibilities.length)];
            colors.push(possibility);
        }

        colors.splice(differentTargetIndex, 0, unique);
        
        return colors;
    }
}