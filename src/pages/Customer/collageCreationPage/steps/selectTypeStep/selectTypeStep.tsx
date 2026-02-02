import React from "react";
import styles from "./selectTypeStep.module.css";
import imageCollage from "../../../../../assets/exampleImageCollage.png";
import textCollage from "../../../../../assets/exampleTextCollage.png";
import symbolCollage from "../../../../../assets/exampleSymbolCollage.png";
import { CollageCreationType } from "../../enums/collageCreationType";
import GeneralButton from "../../../../../components/generalButton/generalButton";
import { CollageCreationStep } from "../../enums/collageCreationStep";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";

interface SelectTypeStepProps {
  setCurrentStep: (newStep: CollageCreationStep) => void;
  setType: (newType: CollageCreationType) => void;
  dbUtils: any;
  defaultType: CollageCreationType;
}

interface CollageTypeOption {
  title: string;
  type: CollageCreationType;
  considerations: string[];
  image: any;
}

export function SelectTypeStep({
  setCurrentStep,
  setType,
  dbUtils,
  defaultType,
}: SelectTypeStepProps) {
  const collageOptions: CollageTypeOption[] = [
    {
      title: "Image",
      type: CollageCreationType.Image,
      considerations: [
        "Only black and white",
        'You cannot select the small image size (0.3" x 0.3")',
        'Output image must be 24" x 24" or larger',
        "Most unique",
      ],
      image: imageCollage,
    },
    {
      title: "Text",
      type: CollageCreationType.Text,
      considerations: [
        "Can output in black and white or color",
        "Can use small, medium, or large image sizes in step 2",
        'Output image must be 12" x 12" or greater',
      ],
      image: textCollage,
    },
    {
      title: "Symbol",
      type: CollageCreationType.Symbol,
      considerations: [
        "Similar considerations as text collage",
        "There are a limited number of symbols to choose from",
        "You may request custom symbol if you do not like the options",
      ],
      image: symbolCollage,
    },
  ];

  const clickedSelect = (type: CollageCreationType) => {
    setType(type);
    if (type === defaultType) {
      dbUtils.storeType(type);
    }
    setCurrentStep(CollageCreationStep.SelectOutputSizeStep);
  };

  return (
    <div className="flex gap-6 justify-center mt-8">
      {collageOptions.map((option) => (
        <Card className="w-85" key={option.title}>
          <CardHeader>
            <CardTitle>Custom {option.title} Mosaic</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={option.image}
              alt={`${option.title} Collage Example`}
              className="w-full rounded-md mb-4"
            />
            {option.considerations.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold mb-2">Considerations:</p>
                {option.considerations.map((consideration, index) => (
                  <p className="text-sm mb-1" key={index}>
                    • {consideration}
                  </p>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => clickedSelect(option.type)}
            >
              Select
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
