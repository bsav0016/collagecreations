import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../../layout/navBars/navBar';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import GeneralButton from '../../../components/generalButton/generalButton';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import { BACKEND_URL } from '../../../utils/constants/constants';

function DownloadAccess(): React.ReactElement {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let url: string | null = null;

        const fetchImage = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}api/download/${token}/`);
                if (!response.ok) {
                    navigate('/');
                    return;
                }
                const blob = await response.blob();
                url = URL.createObjectURL(blob);
                setImageUrl(url);
            } catch {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [token, navigate]);

    const downloadImage = (): void => {
        if (imageUrl) {
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = 'collage.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <div>
            <NavBar />
            {loading ? (
                <LoadingScreen message="Loading your image..." />
            ) : imageUrl ? (
                <div className="text-center py-5">
                    <MediumLogoHeader title="Download Your Image" />
                    <GeneralButton onClick={downloadImage} text="Download" />
                    <div className="w-4/5 justify-self-center mt-4">
                        <img src={imageUrl} alt="Your Collage" className="w-full" />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default DownloadAccess;
