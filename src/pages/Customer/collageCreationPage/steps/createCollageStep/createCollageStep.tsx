import GeneralButton from "../../../../../components/generalButton/generalButton";
import { CollageCreationType } from "../../enums/collageCreationType";
import { OutputSize } from "../../enums/OutputSize";
import { SmallImageSize } from "../../enums/SmallImageSize";
import { createCollage } from "../../../../../services/createCollage";
import { useNavigate } from "react-router-dom";
import { useOrderContext } from "../../../../../context/orderContext";
import { useAuth } from "../../../../../context/authContext";

interface CreateCollageStepProps {
    type: CollageCreationType;
    outputSize: OutputSize;
    mainImage: string | null;
    smallImageSize: SmallImageSize;
    lightDarkArray: boolean[][];
    smallImages: string[];
    color: boolean;
    setShowLoading: (isLoading: boolean) => void
    setLoadingMessage: (loadingMessage: string | null) => void;
    isAdmin: boolean;
}

export function CreateCollageStep({
    type,
    outputSize,
    mainImage,
    smallImageSize,
    lightDarkArray,
    smallImages,
    color,
    setShowLoading,
    setLoadingMessage,
    isAdmin
}: CreateCollageStepProps) {
    const navigate = useNavigate();
    const { setTemporaryImageId, setWatermarkCollage, setBaseCost } = useOrderContext();
    const { userToken } = useAuth();


    const clickedCreateCollage = async () => {
        try {
            setShowLoading(true);
            setLoadingMessage("Creating your collage. This may take a minute...");
            const collageData = await createCollage(
                userToken,
                false,
                type,
                outputSize,
                smallImageSize,
                smallImages,
                mainImage,
                lightDarkArray,
                color
            );

            setTemporaryImageId(collageData.temporaryImageId);
            setWatermarkCollage(collageData.watermarkCollage);
            setBaseCost(collageData.baseCost);

            const navigationUrlExt = isAdmin ? '/admin/admin-preview/' : '/preview/'
            navigate(navigationUrlExt, {state: { isAdmin: isAdmin }});
        } catch (error) {
            alert("Error");
            console.error(error);
        } finally {
            setLoadingMessage(null);
            setShowLoading(false);
        }
    }

    return (
        <div className="flex self-center justify-self-center">
            <GeneralButton text={'Create Collage'} onClick={clickedCreateCollage}/>
        </div>
    )
}