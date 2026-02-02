import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import CheckoutForm from '../../../components/checkoutForm/checkoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import NavBar from '../../../layout/navBars/navBar';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import FormField from '../../../components/form/formField';
import { useConstants } from '../../../context/constantsContext';
import { MARGINS, STRIPE_KEY } from '../../../utils/constants/constants';
import GeneralButton from '../../../components/generalButton/generalButton';
import Form from '../../../components/form/form';
import RequiredFieldDesignator from '../../../components/requiredFieldDesignator/requiredField';
import HeaderSection from '../../../components/headerSection';
import BillingRow from '../../../components/billingSection/billingRow';
import BillingSection from '../../../components/billingSection/billingSection';
import PaymentService from '../../../services/PaymentService';
import { toastRef } from '../../../context/toastContext/toastContext';
import TextInput from '../../../components/textInput/textInput';
import applyDiscountService from '../../../services/ApplyDiscountService';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import { useOrderContext } from '../../../context/orderContext';

interface DownloadFormData {
  firstname: string;
  lastname: string;
  email: string;
  zipCode: string;
  [key: string]: unknown;
}

interface FormFieldConfig {
  type: string;
  text: string;
  id: string;
  value: string;
}

function Download(): React.ReactElement {
  const { constants } = useConstants();
  const { temporaryImageId } = useOrderContext();

  const [tax, setTax] = useState<number | null>(null);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<DownloadFormData>({
    firstname: '',
    lastname: '',
    email: '',
    zipCode: ''
  });
  const [formValid, setFormValid] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('Input first name');
  const stripePromise = loadStripe(STRIPE_KEY);

  useEffect(() => {
    const sessionData = sessionStorage.getItem('orderSessionData');
    if (sessionData) {
      const pastFormData = JSON.parse(sessionData);
      setFormData(pastFormData);
      validateForm(pastFormData);
    }
  }, []);
  
  useEffect(() => {
    sessionStorage.setItem('orderSessionData', JSON.stringify(formData));
  }, [formData]);

  const doCalculateTax = async (): Promise<void> => {
    setProcessing(true);
    try {
      const taxData = await PaymentService.calculateTax(temporaryImageId);
      const updatedTax = taxData.tax;
      setTax(updatedTax);
    } catch (error) {
      toastRef.current?.(`${(error as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleFormSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (tax) {
      setTax(null);
    } else {
      doCalculateTax();
    }
  };

  const initialFields: FormFieldConfig[] = [
    { type: 'text', text: 'First Name: ', id: 'firstname', value: formData.firstname },
    { type: 'text', text: 'Last Name: ', id: 'lastname', value: formData.lastname },
    { type: 'email', text: 'Email: ', id: 'email', value: formData.email },
    { type: 'text', text: 'ZIP Code: ', id: 'zipCode', value: formData.zipCode },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { id, value } = e.target;
    setFormData(prevFormData => {
      const updatedFormData = {
        ...prevFormData,
        [id]: value
      };
  
      validateForm(updatedFormData);
      return updatedFormData;
    });
  };

  const validateForm = (checkFormData: DownloadFormData): void => {
    const isEmailValid = checkFormData.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkFormData.email) : false;
    const isZipCodeValid = checkFormData.zipCode ? /^\d{5}$/.test(checkFormData.zipCode) : false;
    const isFirstNameValid = checkFormData.firstname ? checkFormData.firstname.trim() !== '' : false;
    const isLastNameValid = checkFormData.lastname ? checkFormData.lastname.trim() !== '' : false;

    if (!isFirstNameValid) { setErrorText('Input first name'); }
    else if (!isLastNameValid) { setErrorText('Input last name'); }
    else if (!isEmailValid) { setErrorText('Invalid email address'); }
    else if (!isZipCodeValid) { setErrorText('Zip code must be 5 digits'); }
    else { 
      setFormValid(true); 
      return;
    }

    setFormValid(false);
  };

  const addDiscount = async (): Promise<void> => {
    try {
      const newDiscount = await applyDiscountService(discountCode, temporaryImageId, 'download');
      setDiscount(newDiscount);
    } catch {
      alert('Could not apply discount');
    }
  };

  return (
    <div>
      {loading &&
        <div className="fixed top-0 left-0 w-full h-full z-[1000] flex justify-center items-center">
          <LoadingScreen message={"Processing payment. This may take a minute..."} />
        </div>
      }
      <NavBar/>
      <div className="text-center py-5">
        <MediumLogoHeader title="Download Order"/>
        <RequiredFieldDesignator />
        
        <Form onSubmit={handleFormSubmit}>
          {initialFields.map(field => (
            <FormField
              key={field.id}
              type={tax ? 'label' : field.type}
              text={field.text}
              id={field.id}
              value={field.value}
              onChange={handleChange}
              required={true}
              disabled={processing}
              maxLength={100}
            />
          ))}

          <GeneralButton
            type={'submit'}
            disabled={!stripePromise || !formValid || processing}
            text={tax ? "Edit Info" : formValid ? "Go To Billing" : errorText}
          />  
        </Form>   

        {tax && constants &&
        <div>
          <HeaderSection 
            title="Pricing Info"
            fontWeight='bold'
            fontSize={24}
            marginTop={MARGINS.LARGE}
          >
            <BillingSection>
              <BillingRow
                text1="Download Cost"
                text2={`$${(constants.AMOUNT_DOWNLOAD / 100).toFixed(2)}`}
              />

              <BillingRow
                text1="General Excise Tax"
                text2={`$${(tax / 100).toFixed(2)}`}
                lastCharge={discount > 0 ? false : true}
              />

              {discount > 0 &&
              <BillingRow
                text1={`Discount (${discount * 100}%)`}
                text2={`-$${((constants.AMOUNT_DOWNLOAD / 100 + tax / 100) * discount).toFixed(2)}`}
                lastCharge={true}
              />
              }

              <BillingRow
                text1="Total Cost"
                text2={`$${((constants.AMOUNT_DOWNLOAD / 100 + tax / 100) * (1 - discount)).toFixed(2)}`}
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
            fontSize={24}
            fontWeight='bold'
            marginTop={MARGINS.LARGE}
          >
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                formValid={formValid} 
                formData={formData}
                type={'download'} 
                tempImageId={temporaryImageId} 
                setLoading={setLoading}
              />
            </Elements>
          </HeaderSection>
        </div>
        }
      </div>
    </div>
  );
}

export default Download;
