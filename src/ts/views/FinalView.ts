import "jquery";
import { View } from "./View";

interface ViewParameter {
    fileName: string;
    csv: string;
};

export class FinalView extends View<ViewParameter> {
    beforeRender(parameter: ViewParameter): void {
        this.node = $("<div>")
            .attr("id", "final-view");
        
        $("<h1>")
            .text("The end!")
            .appendTo(this.node);

        if (parameter.fileName === "DEMO") {
            $("<p>")
                .text("You are now ready for the real experiment!")
                .appendTo(this.node);
        } else {
            $("<p>")
                .text("Thank you for your participation.")
                .appendTo(this.node);

            $("<button>")
                .attr("id", "download-csv-button")
                .text("Download results as CSV")
                .on("click", () => {
                    this.downloadCSVFile(parameter);
                })
                .appendTo(this.node);
        }
    }

    render(): void {
        $("body")
            .append(this.node);
    }

    destroy(): void {
        this.node.remove();
    }

    downloadCSVFile(parameter: ViewParameter) {
        let filename = parameter.fileName
        let csvFileBlob = new Blob([parameter.csv], { type: "text/csv;charset=utf-8" });

        (window["saveAs"])(csvFileBlob, filename);
    }
}