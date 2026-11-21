import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { STRIPE_KEY } from "./constants/constants";

// One Stripe instance for the whole app. Calling loadStripe inside a component made a new instance on every render,
// and gave <Elements> a different `stripe` prop each time (React Stripe warns that it cannot change). It is still
// loaded lazily, on the first checkout page, so other pages never fetch Stripe.js.
let stripePromise: Promise<Stripe | null> | undefined;

export function getStripe(): Promise<Stripe | null> {
    stripePromise ??= loadStripe(STRIPE_KEY);
    return stripePromise;
}
