import GeneralButton from "../../../../../components/generalButton/generalButton";
import { CollageCreationType } from "../../enums/collageCreationType";
import { OutputSize } from "../../enums/OutputSize";
import { SmallImageSize } from "../../enums/SmallImageSize";
import { createCollage } from "../../../../../services/createCollage";
import { useNavigate } from "react-router-dom";
import { useOrderContext } from "../../../../../context/orderContext";
import { useAuth } from "../../../../../context/authContext";
import { useCustomerAuth } from "../../../../../context/customerAuthContext";
import { claimCollage } from "../../../../../services/customerAuthService";

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
    setLoadingProgress: (loadingProgress: number | null) => void;
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
    setLoadingProgress,
    isAdmin
}: CreateCollageStepProps) {
    const navigate = useNavigate();
    const { setTemporaryImageId, setWatermarkCollage, setBaseCost, setPreviewLocked, setExpiresAt } = useOrderContext();
    const { userToken } = useAuth();
    const { customerToken } = useCustomerAuth();


    const clickedCreateCollage = async () => {
        try {
            setShowLoading(true);
            setLoadingMessage("Creating your collage. This may take a minute...");
            setLoadingProgress(0);
            const collageData = await createCollage(
                userToken,
                false,
                type,
                outputSize,
                smallImageSize,
                smallImages,
                mainImage,
                lightDarkArray,
                color,
                setLoadingProgress,
                customerToken
            );

            setTemporaryImageId(collageData.temporaryImageId);
            setWatermarkCollage(collageData.watermarkCollage);
            setBaseCost(collageData.baseCost);
            setPreviewLocked(collageData.requiresSignin);
            setExpiresAt(collageData.expiresAt);

            // A signed-in customer's collage is attached to them right away so it is kept longer.
            if (customerToken && !isAdmin) {
                try {
                    const claimed = await claimCollage(customerToken, collageData.temporaryImageId);
                    setExpiresAt(claimed.expires_at);
                } catch (claimError) {
                    console.error(claimError); // not fatal: the collage still works, it just expires sooner
                }
            }

            const navigationUrlExt = isAdmin ? '/admin/admin-preview/' : '/preview/'
            navigate(navigationUrlExt, {state: { isAdmin: isAdmin }});
        } catch (error) {
            alert("Error");
            console.error(error);
        } finally {
            setLoadingMessage(null);
            setLoadingProgress(null);
            setShowLoading(false);
        }
    }

    return (
        <div className="flex justify-center">
            <GeneralButton text={'Create Collage'} onClick={clickedCreateCollage} variant="primary"/>
        </div>
    )
}