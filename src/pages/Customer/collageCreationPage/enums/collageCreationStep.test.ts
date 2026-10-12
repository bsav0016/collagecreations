import { describe, expect, it } from "vitest";
import { CollageCreationStep, getStepOrderForType } from "./collageCreationStep";
import { CollageCreationType } from "./collageCreationType";

describe("getStepOrderForType", () => {
    it("photo collages skip the small-photo size and preview steps", () => {
        const steps = getStepOrderForType(CollageCreationType.Image);

        expect(steps).not.toContain(CollageCreationStep.SelectSmallSizeStep);
        expect(steps).not.toContain(CollageCreationStep.PreviewStep);
        expect(steps[0]).toBe(CollageCreationStep.SelectTypeStep);
        expect(steps[steps.length - 1]).toBe(CollageCreationStep.CreateCollageStep);
    });

    it.each([CollageCreationType.Text, CollageCreationType.Symbol])("type %i goes through every step in order", (type) => {
        expect(getStepOrderForType(type)).toEqual([
            CollageCreationStep.SelectTypeStep,
            CollageCreationStep.SelectOutputSizeStep,
            CollageCreationStep.SelectOutputStep,
            CollageCreationStep.SelectSmallSizeStep,
            CollageCreationStep.PreviewStep,
            CollageCreationStep.SelectImagesStep,
            CollageCreationStep.CreateCollageStep,
        ]);
    });
});
