import React from 'react';
import bigLogo from '../../assets/big-logo.png';
import GeneralButton from '../../components/generalButton/generalButton';
import { useNavigate } from 'react-router-dom';

function NotFound(): React.ReactElement {
    const navigate = useNavigate();
    return (
        <div className="text-center py-5">
            <div className="flex justify-center flex-col items-center">
                <img src={bigLogo} alt="Big Logo" className="w-[20%] max-w-[300px] h-auto" />
                <label className="font-bold text-[28px] mb-2.5">Error 404: Page Not Found</label>
                <label className="text-sm">If you're looking for Collage Creations, please click the below button to be routed to the homepage.</label>
                <GeneralButton
                    onClick={() => { navigate('/') }}
                    text={'Homepage'}
                />
            </div>
        </div>
    );
}

export default NotFound;
