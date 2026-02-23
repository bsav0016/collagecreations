import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import GeneralButton from "../generalButton/generalButton";
import { useLocalDatabase } from "../../context/databaseContext";
import { databaseUtils } from "../../pages/Customer/collageCreationPage/databaseUtils";
import { CollageCreationType } from "../../pages/Customer/collageCreationPage/enums/collageCreationType";
import { CollageCreationStep } from "../../pages/Customer/collageCreationPage/enums/collageCreationStep";

interface CollageTypeCardProps {
  title: string;
  description: string;
  type: CollageCreationType;
  image: string;
  imageAlt: string;
  children?: React.ReactNode;
}

export function CollageTypeCard({
  title,
  description,
  type,
  image,
  imageAlt,
  children,
}: CollageTypeCardProps) {
  const navigate = useNavigate();
  const { setVariable, loadVariable } = useLocalDatabase();
  const dbUtils = databaseUtils(setVariable, loadVariable);

  const handleGetStarted = async () => {
    await dbUtils.storeType(type);
    navigate(`/collage/${CollageCreationStep.SelectOutputSizeStep}`);
  };

  return (
    <article>
      <Card className="w-85">
        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <div className="flex justify-center">
            <GeneralButton
              text="Get Started"
              onClick={handleGetStarted}
              variant="primary"
            />
          </div>
        </CardHeader>
        <CardContent>
          <img
            src={image}
            alt={imageAlt}
            className="w-full rounded-md mb-4"
          />
          <div className="text-base">
            {children}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
