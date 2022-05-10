import React, { ReactElement, useEffect, useRef, useState } from "react"

// @ts-ignore 
import { authenticate } from "@onflow/fcl";
import "../components/market/PurchaseDialog/PurchaseDialogStyles.css";
import { useLocation, useNavigate, useParams } from "react-router";
import { useMarket } from "../contexts/MarketContext";
import { useWallet } from "../contexts/WalletContext";
import MediaDisplay from "../components/market/PurchaseDialog/MediaDisplay";
import InfoView from "../components/market/PurchaseDialog/InfoView";
import ConfirmView from "../components/market/PurchaseDialog/ConfirmView";
import { MarketConsumer } from "../contexts/MarketContext";
import { classNames } from "../utils/classNames";
import ReactGA from "react-ga";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Button from "../components/general/Button";
import { BsArrowLeft } from "react-icons/bs";
import RelatedTokensList from "../components/general/TokenInfo/RelatedTokensList";


export enum FlowPurchaseError {
    INSUFFICIENT_FUNDS = "insufficient_funds",
    LISTING_UNAVAILABLE = "listing_unavailable",
    GENERAL_ERROR = "general_error",
    NONE = "none"
}

type PurchaseDialogProps = {
    className?: string;
    videoProps?: object;
    prioritizeVideo?: boolean;
    handleClick?: () => void;
};

export enum PurchaseTransactionState {
    success ="success",
    confirm = "confirm",
    error   = "error",
    pending = "pending",
    pre     = "pre"
}

export declare interface IIconButtonProps {
    className: string;
    onClick: () => void;
    disabled?: boolean;
}

export const stripePromise = loadStripe(process.env.REACT_APP_CHAIN_ENV === "mainnet" ? process.env.REACT_APP_STRIPE_KEY_LIVE! : process.env.REACT_APP_STRIPE_KEY_TEST!);

const PurchaseFlowTab: React.FC<any> = ({ showOn, value, children }) => (
	<div className={
		classNames([
			showOn !== value ? "hidden" : "",
			"h-full flex flex-col"
		])
	}>
		{children}
	</div>
) 

/**
 * @description Display more information about a token, allow the user to purchase, and view related tokens
 */
const TokenInfoPage: React.FC<PurchaseDialogProps> = ({
	videoProps,
	prioritizeVideo = true,
}): ReactElement<HTMLDivElement> => {

	const [tabValue, setTabValue] = useState(0);
	const [clientSecret, setClientSecret] = useState("");
	const [stripeLoadError, setStripeLoadError] = useState<boolean>(false);

	const { loggedIn, email, user, validateCollection } = useWallet();
	const { tokenDatas }            = useMarket();
	const { id }                    = useParams();
	const location                  = useLocation();
	const navigate                  = useNavigate();

	const token = tokenDatas[id ?? ""];

	useEffect(() => {
		if (token) {
			ReactGA.plugin.execute("ec", "addProduct", {
				id: token.id,
				name: token.name,
				category: "BakeSale Can",
				brand: token.brewery,
				price: Math.ceil(Number(token.price) / 100),
				quantity: 1
			})

			ReactGA.plugin.execute("ec", "setAction", "detail");

			ReactGA.plugin.execute("ec", "addImpression", {
				id: token.id,
				name: token.name,
				category: "BakeSale Can",
				brand: token.brewery
			})

			ReactGA.pageview(location.pathname + location.search);

			userBeginsCheckout();
            
		}
	}, [token])

	useEffect(() => {
		if (tabValue === 1) {
			userIntendsToPurchase();
		}
	}, [tabValue])

	const createSession = async () => {

		try {
			const session: any = await axios.post(
				`https://44prllk7e2.execute-api.us-east-1.amazonaws.com/Prod/${process.env.REACT_APP_CHAIN_ENV === "mainnet" ? "stripe_payment_intent" : "stripe_payment_intent_testnet"}?network=${process.env.REACT_APP_CHAIN_ENV}`,
				{
					product_id: token.product_id,
					customer_email: email,
					flow_wallet_address: user?.addr
				},
				{
					headers: {
						"Access-Control-Allow-Origin": "*",
					},
				})

			setClientSecret(session?.data?.clientSecret)

		} catch (err) {
			setStripeLoadError(true);
			return
		}
	};

	useEffect(() => {
		if (loggedIn && email) {
			stripePromise.then(() => {
				createSession();
			})
		}
	}, [email])

	const userBeginsCheckout = () => {
		ReactGA.plugin.execute("ec", "addProduct", {
			id: token.id,
			name: token.name,
			category: "BakeSale Can",
			brand: token.brewery,
			price: Math.ceil(Number(token.price) / 100),
			quantity: 1
		})

		ReactGA.plugin.execute("ec", "setAction", "add");
		ReactGA.ga("send", "event", "UX", "click", "Checkout", {})
	}

	const userIntendsToPurchase = () => {
		ReactGA.plugin.execute("ec", "setAction", "checkout_option", {
			step: 2,
		})
	}
    
	// Manage which screen in the modal is being displayed to the user
	// 1. Info
	// 2. Confirm
	// 3. Transaction/loading
	// 4. Success/error
	const [purchaseTransactionState, setPurchaseTransactionState] = useState<PurchaseTransactionState>(PurchaseTransactionState.pre)

	const isPre     = purchaseTransactionState === PurchaseTransactionState.pre
	const isConfirm = purchaseTransactionState === PurchaseTransactionState.confirm
	const isPending = purchaseTransactionState === PurchaseTransactionState.pending
	const isSuccess = purchaseTransactionState === PurchaseTransactionState.success
	const isError   = purchaseTransactionState === PurchaseTransactionState.error

	// Manage the actual transaction flow after a user has "confirmed" they want a token
	// All state visual changes take place inside of PendingPurchaseView
	const [purchaseError, setPurchaseError] = useState<FlowPurchaseError>(FlowPurchaseError.NONE);

	const infoViewRef = useRef<HTMLDivElement>(null);
	const mediaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!loggedIn) {
			setPurchaseTransactionState(PurchaseTransactionState.pre)
			setTabValue(0);
		}
	}, [loggedIn])

	if (!token) {
		return <div></div>;
	}

	const { animation_url, image } = token;


	const handlePurchaseButtonClick = async () => {
		switch (purchaseTransactionState) {
		case PurchaseTransactionState.pre:
			preAuthenticatePurchase();
			break;
		case PurchaseTransactionState.confirm:
			setPurchaseTransactionState(PurchaseTransactionState.pending);
			break;
		case PurchaseTransactionState.pending:
			return
		case PurchaseTransactionState.error:
			setPurchaseTransactionState(PurchaseTransactionState.pre)
			break;
		case PurchaseTransactionState.success:
			// TODO: add in success callback
			break;
		default:
			return;
		}
	}

	const handleError = (cadenceError: string) => {
		if (cadenceError?.indexOf("Amount withdrawn must be less than or equal than the balance") !== -1) {
			setPurchaseError(FlowPurchaseError.INSUFFICIENT_FUNDS)
		} else if (cadenceError?.includes("listing has already been purchased")) {
			setPurchaseError(FlowPurchaseError.LISTING_UNAVAILABLE)
		}
	}

	const purchaseToken = async () => {

		try {
			setPurchaseTransactionState(PurchaseTransactionState.pending);
			// Successful purchase
		} catch (err: any) {
			handleError(err)
			setPurchaseTransactionState(PurchaseTransactionState.error);
		}
	}

	const preAuthenticatePurchase = async () => {

		if (!loggedIn) {
			authenticate()
				.then(async (user: any) => {
					if (user.loggedIn) {
						await validateCollection(user)
						setTabValue(1);
						await purchaseToken(); 
					} else {
						setTabValue(0);
						setPurchaseTransactionState(PurchaseTransactionState.pre)
						return 
					}
				})
				.catch((err: any) => {
					setPurchaseTransactionState(PurchaseTransactionState.pre)
					setPurchaseError(err)
					return
				})
		} else {
			await validateCollection(user)
			setTabValue(1);
			await purchaseToken();
		}
	};
        
	const isAbleToPurchase = !isPending && token.active;
    
	return (
		<MarketConsumer>
			{() => (
				<div className="flex w-full justify-center p-4 md:py-24">
					<div className="flex flex-col max-w-4xl">
						<Button
							className="flex items-center mb-4 hover:text-theme-blue duration-200 hover:brightness-75"
							onClick={() => navigate("/")}
						>
							<BsArrowLeft className="mr-2" /> Back to home
						</Button>
						<div className="grid grid-cols-12 max-w-4xl md:gap-x-8 bg-white rounded-2xl p-4 md:p-8 shadow-lg duration-200">
							<div className="col-span-12 md:col-span-6 shadow-lg rounded-xl aspect-square">
								<MediaDisplay
									animationSrc={animation_url}
									imageSrc={image}
									prioritizeVideo={prioritizeVideo}
									videoProps={videoProps}
									ref={mediaRef}
								/>
							</div>
							<div className="col-span-12 md:col-span-6 flex flex-col mt-8 md:mt-0">
								<PurchaseFlowTab showOn={0} value={tabValue}>
									<InfoView
										token={token}
										isAbleToPurchase={isAbleToPurchase}
										ref={infoViewRef}
									/>
								</PurchaseFlowTab>
								<PurchaseFlowTab showOn={1} value={tabValue}>
									<ConfirmView
										token={token}
										clientSecret={clientSecret}
										stripeLoadError={stripeLoadError}
									/>
								</PurchaseFlowTab>
								<button className={classNames([
									"mt-8 bg-theme-bluegray text-blue-900 rounded-xl font-semibold py-2 w-full z-40 disabled:bg-gray-200 disabled:text-gray-400",
									tabValue === 1 ? "hidden" : ""
								])}
								onClick={handlePurchaseButtonClick}
								disabled={!isAbleToPurchase}
								>
									{!token.active && "Currently unavailable"}
									{token.active && isPre && (loggedIn ? ((token.price) ? "Purchase" : "Unavailable") : "Sign in to purchase")}
									{isConfirm && "Confirm purchase"}
									{isPending && "Purchase pending"}
									{isSuccess && "Go to home"}
									{isError && "Return token overview"}
								</button>
							</div>
						</div>
						<RelatedTokensList token={token}/>
					</div>
				</div>
			)}
		</MarketConsumer>
	)
};

export default TokenInfoPage;
