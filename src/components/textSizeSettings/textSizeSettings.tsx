import { useTextSize, TextSize } from "../../context/textSizeContext";

export function TextSizeSettings() {
    const { textSize, setTextSize } = useTextSize();

    return (
        <div className="flex flex-col gap-3">
            <label className="text-base font-medium text-foreground">Text Size</label>
            <select
                value={textSize}
                onChange={(e) => setTextSize(e.target.value as TextSize)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
            </select>
            <p className="text-sm text-muted-foreground">
                Adjusts text size across the entire application.
            </p>
        </div>
    );
}
