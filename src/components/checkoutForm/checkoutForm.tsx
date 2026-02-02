import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import GeneralButton from "../generalButton/generalButton";
import PaymentService from "../../services/PaymentService";
import { toastRef } from "../../context/toastContext/toastContext";
import LoadingDots from "../loadingDots";

interface CheckoutFormData {
    firstname: string;
    lastname: string;
    email: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode: string;
}

interface CheckoutFormProps {
    formValid: boolean;
    formData: CheckoutFormData;
    type: string;
    tempImageId: number;
    setLoading: (loading: boolean) => void;
}

function CheckoutForm({ formValid, formData, type, tempImageId, setLoading }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setProcessing(true);
        setLoading(true);
        event.preventDefault();

        const cardElement = elements?.getElement(CardElement);
        if (!cardElement || !stripe) {
            setProcessing(false);
            setLoading(false);
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            setProcessing(false);
            setLoading(false);
            toastRef.current?.("Error processing payment: " + error.message);
            return;
        }

        try {
            const response = await PaymentService.createPayment(
                paymentMethod,
                tempImageId,
                type,
                formData
            );

            setLoading(false);
            navigate("/confirmation/", {
                state: { id: response.id, email: formData.email, collage: response.collage },
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            toastRef.current?.(errorMessage);
            setLoading(false);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mx-auto my-[5px] max-w-[400px] bg-white p-[5px] rounded-[5px]">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#000",
                                "::placeholder": {
                                    color: "#999",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                />
            </div>

            <GeneralButton
                type="submit"
                disabled={!stripe || !elements || !formValid || processing}
                text={
                    processing ? (
                        <>
                            Processing
                            <LoadingDots />
                        </>
                    ) : formValid ? (
                        "Complete Order"
                    ) : (
                        "Fill all required fields"
                    )
                }
            />
        </form>
    );
}

export default CheckoutForm;
