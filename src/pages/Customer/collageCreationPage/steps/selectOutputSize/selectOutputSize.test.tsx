import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SelectOutputSizeStep } from "./selectOutputSize";
import { CollageCreationType } from "../../enums/collageCreationType";
import { CollageCreationStep } from "../../enums/collageCreationStep";
import { OutputSize } from "../../enums/OutputSize";

const setup = (type: CollageCreationType, defaultOutputSize = OutputSize.x24x24) => {
    const props = {
        setCurrentStep: vi.fn(),
        setOutputSize: vi.fn(),
        dbUtils: { storeOutputSize: vi.fn() },
        type,
        defaultOutputSize,
    };
    render(<SelectOutputSizeStep {...props} />);
    return props;
};

const sizeButtons = () => screen.getAllByRole("button").map((b) => b.textContent);

describe("SelectOutputSizeStep", () => {
    it("offers only large sizes for photo collages", () => {
        setup(CollageCreationType.Image);

        expect(sizeButtons()).toEqual(['24 x 24"', '24 x 36"', '36 x 24"']);
    });

    it("offers every size for text collages", () => {
        setup(CollageCreationType.Text);

        expect(sizeButtons()).toHaveLength(6);
    });

    it("offers only the two square sizes for symbol collages", () => {
        setup(CollageCreationType.Symbol);

        expect(sizeButtons()).toEqual(['12 x 12"', '24 x 24"']);
    });

    it("shows no Continue button until a size is chosen", () => {
        setup(CollageCreationType.Image);

        expect(screen.queryByText("Continue")).toBeNull();
    });

    it("continues to the next step with the chosen size", () => {
        const props = setup(CollageCreationType.Image);

        fireEvent.click(screen.getByText('24 x 36"'));
        expect(screen.getByText('24 x 36"').closest("button")?.getAttribute("aria-pressed")).toBe("true");
        fireEvent.click(screen.getByText("Continue"));

        expect(props.setOutputSize).toHaveBeenCalledWith(OutputSize.x24x36);
        expect(props.setCurrentStep).toHaveBeenCalledWith(CollageCreationStep.SelectOutputStep);
    });

    it("remembers the size when it is the default one", () => {
        const defaultPick = setup(CollageCreationType.Image, OutputSize.x24x24);
        fireEvent.click(screen.getByText('24 x 24"'));
        fireEvent.click(screen.getByText("Continue"));
        expect(defaultPick.dbUtils.storeOutputSize).toHaveBeenCalledWith(OutputSize.x24x24);
    });

    it("does not store a non-default size", () => {
        const props = setup(CollageCreationType.Image, OutputSize.x24x24);
        fireEvent.click(screen.getByText('36 x 24"'));
        fireEvent.click(screen.getByText("Continue"));
        expect(props.dbUtils.storeOutputSize).not.toHaveBeenCalled();
    });
});
