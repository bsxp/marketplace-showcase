import React from "react"
import { IBeerTokenSetData } from "../../../contexts/types";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import LoadingIndicator from "../../general/LoadingIndicator";
import Button from "../../general/Button";
import { useNavigate } from "react-router";
import { stripePromise } from "../../../pages/TokenInfo";

export interface BeerTokenProductData extends IBeerTokenSetData {
    id?: string;
    product_id?: string;
    price?: number;
    active?: boolean;
    created_at?: string;
}

interface IConfirmViewProps {
    token: BeerTokenProductData;
    clientSecret: any;
    stripeLoadError: any;
}

type StripeAppearance = "stripe" | "night" | "flat" | "none" | undefined;

/**
 * @description Wraps the stripe elements provider and adds a loading indicator when unloaded
 * @todo rename?
 */
const ConfirmView: React.FC<IConfirmViewProps> = ({ token, clientSecret, stripeLoadError }) => {

	const navigate = useNavigate();

	const appearance = {
		theme: "stripe" as StripeAppearance,
	};

	const options = {
		clientSecret,
		appearance,
	};

	return (
		<div className="text-center flex-grow flex flex-col h-full">
			<h3 className="mb-8">
				<span className="text-xl font-bold">Purchase token</span>
			</h3>
			{clientSecret.length === 0 && !stripeLoadError && (
				<div>
					<p>
                        Loading checkout
					</p>
					<div className="pt-10 text-left pl-6">
						<LoadingIndicator />
					</div>
				</div>
			)}
			{clientSecret.length > 0 && !stripeLoadError && (
				<Elements stripe={stripePromise} options={options}>
					<CheckoutForm clientSecret={clientSecret} token={token}/>
				</Elements>
			)}
			{stripeLoadError && (
				<div className="flex flex-col justify-between flex-grow">
					<p className="flex-grow mb-10">
                        Oops, it looks like we&apos;re having difficulty connecting to our payment provider. Please try again later.
					</p>
					<Button onClick={() => navigate("/")} className="bg-theme-bluegray text-blue-900 rounded-xl font-semibold py-2 w-full z-40 disabled:bg-gray-200 disabled:text-gray-400 mt-auto">
                        Back to home
					</Button>
				</div>
			)}
		</div>
	)
}

export default ConfirmView
