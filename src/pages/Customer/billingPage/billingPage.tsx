import React, { useState, useEffect, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutForm from '../../../components/checkoutForm/checkoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import NavBar from '../../../layout/navBars/navBar';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import { MARGINS, STRIPE_KEY } from '../../../utils/constants/constants';
import HeaderSection from '../../../components/headerSection';
import BillingSection from '../../../components/billingSection/billingSection';
import BillingRow from '../../../components/billingSection/billingRow';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import applyDiscountService from '../../../services/ApplyDiscountService';
import GeneralButton from '../../../components/generalButton/generalButton';
import TextInput from '../../../components/textInput/textInput';
import { useOrderContext } from '../../../context/orderContext';

interface BillingFormData {
  firstname: string;
  lastname: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

function BillingPage(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const { temporaryImageId, baseCost, shippingCost, tax, quantity } = useOrderContext();

  const [formData, setFormData] = useState<BillingFormData | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [gettingDiscount, setGettingDiscount] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const {
      formData
    } = location.state || {};

    setFormData(formData);
  }, [location.state, navigate]);

  const stripePromise = loadStripe(STRIPE_KEY);

  const addDiscount = async (): Promise<void> => {
    setGettingDiscount(true);
    try {
      const newDiscount = await applyDiscountService(discountCode, temporaryImageId, 'order');
      setDiscount(newDiscount);
    } catch {
      alert('Could not apply discount');
    } finally {
      setGettingDiscount(false);
    }
  };

  return (
    <div>
      <NavBar />
      {(!(formData && baseCost && shippingCost && tax && quantity && temporaryImageId) || gettingDiscount) ? (
        <LoadingScreen message={"Processing your request..."} />
      ) : (
        <div className="text-center py-5">
          {loading && 
            <div className="fixed top-0 left-0 w-full h-full z-[1000] flex justify-center items-center">
              <LoadingScreen message={"Processing payment. This may take a minute..."} />
            </div>
          }
          <MediumLogoHeader title={"Checkout Page"} />
          
          <HeaderSection 
            title="Shipping Info"
            fontSize={22}
            fontWeight='bold'
          >
            <div className="[&_p]:mt-0.5 [&_p]:mb-0.5">
              <p>{formData.firstname} {formData.lastname}</p>
              <p>{formData.address1}</p>
              {formData.address2 !== '' && <p>{formData.address2}</p>}
              <p>{formData.city}, {formData.state} {formData.zipCode}</p>
            </div>
          </HeaderSection>          

          <HeaderSection
            title="Pricing Info"
            fontSize={22}
            fontWeight='bold'
            marginTop={MARGINS.LARGE}
          >
            <BillingSection>
              <BillingRow 
                text1="Order Quantity"
                text2={quantity.toString()}
              />

              <BillingRow 
                text1="Order Cost"
                text2={`$${(baseCost * quantity / 100).toFixed(2)}`}
              />

              <BillingRow
                text1="Shipping Cost"
                text2={`+$${(shippingCost / 100).toFixed(2)}`}
              />

              <BillingRow
                text1="General Excise Tax"
                text2={`+$${(tax / 100).toFixed(2)}`}
                lastCharge={discount > 0 ? false : true}
              />

              {discount > 0 &&
                <BillingRow
                  text1={`(not applied to shipping) Discount (${discount * 100}%)`}
                  text2={`-$${((baseCost * quantity + tax) * discount / 100).toFixed(2)}`}
                  lastCharge={true}
                />
              }

              <BillingRow
                text1="Total Cost"
                text2={`$${((baseCost * quantity + tax) / 100 * (1 - discount) + shippingCost / 100).toFixed(2)}`}
              />
            </BillingSection>
          </HeaderSection>
          
          <div className="flex flex-col items-center">
            <TextInput
              maxWidth='200px'
              placeholder="Discount Code"
              value={discountCode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value)}
            />
            <GeneralButton
              text="Apply Discount"
              onClick={addDiscount}
            />
          </div>
          
          <HeaderSection
            title="Billing Info"
            fontSize={22}
            fontWeight='bold'
            marginTop={MARGINS.LARGE}
          >
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                formValid={true} 
                formData={formData} 
                type={'order'} 
                tempImageId={temporaryImageId} 
                setLoading={setLoading}
              />
            </Elements>
          </HeaderSection>
        </div>
      )}
    </div>
  );
}

export default BillingPage;
