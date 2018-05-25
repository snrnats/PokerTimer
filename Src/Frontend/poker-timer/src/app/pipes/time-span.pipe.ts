import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "timeSpan" })
export class TimeSpanPipe implements PipeTransform {
    transform(totalSeconds: number): string {
        const minutes = Math.trunc(totalSeconds / 60);
        const seconds = Math.trunc(totalSeconds % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
}
