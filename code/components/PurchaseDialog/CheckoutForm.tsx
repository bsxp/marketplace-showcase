import React, { useEffect, useState } from "react";
import { useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js";
import "./CheckoutFormStyles.css";
import ReactGA from "react-ga";
import { BeerTokenProductData } from "./ConfirmView";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";

interface CheckoutFormProps {
  clientSecret: string;
  token: BeerTokenProductData
}

/**
 * @description Stripe checkout form for purchasing a token 
 */
const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, token }) => {
	const stripe = useStripe();
	const elements = useElements();
	const navigate = useNavigate();
  
	const [message, setMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasSubmitted, setHasSubmited] = useState<boolean>(false);

	const userCompletesCheckout = async () => {
		ReactGA.plugin.execute("ec", "addProduct", {
			id: token.id,
			name: token.name,
			category: "BakeSale Can",
			brand: token.metadata!.brewery,
			price: Math.ceil(Number(token.price) / 100),
			quantity: 1
		})

		ReactGA.plugin.execute("ec", "setAction", "purchase", {
			id: uuidv4(),
			affiliation: "BakeSale store",
			revenue: Math.ceil(Number(token.price) / 100),
			step: 3
		})
	}
  
	useEffect(() => {

		// Stripe hasn't initialized yet
		if (!stripe) {
			return;
		}

		// Stripe hasn't returned the client secret yet
		if (!clientSecret) {
			return;
		}
  
		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }: any) => {
			switch (paymentIntent.status) {
			case "succeeded":
				setMessage("Payment succeeded!");
				break;
			case "processing":
				setMessage("Your payment is processing.");
				break;
			case "requires_payment_method":
				setMessage("Your payment was not successful, please try again.");
				break;
			default:
				setMessage("Something went wrong.");
				break;
			}
		});
	}, [stripe]);
  
	const handleSubmit = async (e: any) => {
		e.preventDefault();
  
		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}
  
		setHasSubmited(true);
		setIsLoading(true);
  
		const { error, ...rest } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: window.location.origin + "/checkout/confirm",
			},
			redirect: "if_required"
		});

		if (!error) {
			userCompletesCheckout();
			navigate("/checkout/confirm?redirect_status=" + rest.paymentIntent?.status);
		}
  
		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, your customer will be redirected to
		// a `return_url`.
		if (error?.type === "card_error" || error?.type === "validation_error") {
			setMessage(error.message as any);
		} else {
			setMessage("An unexpected error occured.");
		}
  
		setIsLoading(false);
	};
  
	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<PaymentElement id="payment-element" />
			<button disabled={isLoading || !stripe || !elements} id="submit" className="bg-theme-blue p-2 min-h-[24px] checkout-button">
				<span id="button-text">
					{isLoading ? "Submitting order" : "Confirm Purchase"}
				</span>
			</button>
			{message && hasSubmitted && !isLoading && <div id="payment-message">{message}</div>}
		</form>
	);
}

export default CheckoutForm;