import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
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
    tempImageId: string;
    setLoading: (loading: boolean) => void;
}

function CheckoutForm({ formValid, formData, type, tempImageId, setLoading }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
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
            let response = await PaymentService.createPayment(
                paymentMethod,
                tempImageId,
                type,
                formData
            );

            // The bank asked for 3-D Secure: show Stripe's challenge, then finish the same payment.
            if (response.requiresAction && response.clientSecret) {
                const { error: actionError, paymentIntent } = await stripe.handleNextAction({
                    clientSecret: response.clientSecret,
                });
                if (actionError || !paymentIntent) {
                    throw new Error(`Card authentication failed: ${actionError?.message ?? "please try again"}`);
                }
                response = await PaymentService.createPayment(
                    null,
                    tempImageId,
                    type,
                    formData,
                    paymentIntent.id
                );
            }

            setLoading(false);
            navigate("/confirmation/", {
                state: { id: response.id, email: formData.email, token: response.token },
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
            <div className="mx-auto my-[5px] max-w-[400px] bg-background p-3 rounded-md border border-input">
                {/* Stripe renders in an iframe and can't read CSS variables, so pass the
                    theme's --foreground / --muted-foreground values explicitly. */}
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "18px",
                                color: isDark ? "#f8fafc" : "#000",
                                iconColor: isDark ? "#94a3b8" : "#64748b",
                                "::placeholder": {
                                    color: isDark ? "#94a3b8" : "#64748b",
                                },
                            },
                            invalid: {
                                color: "#ef4444",
                                iconColor: "#ef4444",
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
