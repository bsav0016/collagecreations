import { CollageCreationType } from "./collageCreationType";

export enum CollageCreationStep {
    SelectTypeStep = 'type',
    SelectOutputSizeStep = 'output-size',
    SelectOutputStep = 'output',
    SelectSmallSizeStep = 'small-sizes',
    PreviewStep = 'preview',
    SelectImagesStep = 'select-images',
    CreateCollageStep = 'create-collage'
}

// The full flow, in order. Image-type collages skip straight from the output step to
// SelectImagesStep (see selectOutputStep.tsx), so they never visit SelectSmallSizeStep or
// PreviewStep — getStepOrderForType() below accounts for that when building the stepper.
const ALL_STEPS: CollageCreationStep[] = [
    CollageCreationStep.SelectTypeStep,
    CollageCreationStep.SelectOutputSizeStep,
    CollageCreationStep.SelectOutputStep,
    CollageCreationStep.SelectSmallSizeStep,
    CollageCreationStep.PreviewStep,
    CollageCreationStep.SelectImagesStep,
    CollageCreationStep.CreateCollageStep
];

export const getStepOrderForType = (type: CollageCreationType): CollageCreationStep[] =>
    type === CollageCreationType.Image
        ? ALL_STEPS.filter(
            (step) =>
                step !== CollageCreationStep.SelectSmallSizeStep &&
                step !== CollageCreationStep.PreviewStep,
        )
        : ALL_STEPS;
