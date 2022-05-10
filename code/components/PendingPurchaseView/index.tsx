import React from "react";
import LoadingIndicator from "../../general/LoadingIndicator";

export enum TransactionSteps {
    pendingSignin      = "pending_signin",
    pendingSignature   = "pending_signature",
    pendingTransaction = "pending_transaction"
}

type IPurchaseLoadingViewProps = {
    transactionStep: TransactionSteps | null;
};

/**
 * @description Cute little loading animation while we wait to approve the token purchase transaction
 * @deprecated 
 */
const PurchaseLoadingDialog: React.FC<IPurchaseLoadingViewProps> = ({ transactionStep }) => {

	const isBloctoSignin           = transactionStep === TransactionSteps.pendingSignin;
	const isBloctoPendingSignature = transactionStep === TransactionSteps.pendingSignature;
	const isTransactionPending     = transactionStep === TransactionSteps.pendingTransaction;

	return (
		<div className="flex justify-start items-center w-full h-60 flex-col space-y-4 pt-8 pb-16">
			<LoadingIndicator />
			<div className="my-8">
				<span className="text-black text-center">
					{isBloctoSignin && <p className="text-center text-gray-900 text-lg font-semibold mt-4" >Signing into wallet</p>}
					{isBloctoPendingSignature && <p className="text-center text-gray-900 text-lg font-semibold mt-4">Waiting for transaction approval</p>}
					{isTransactionPending && (
						<>
							<p className="text-center text-gray-900 text-lg font-semibold mt-4">
								<span>
                                    Baking your token...
								</span>
							</p>
							<p className="text-center text-gray-700 text-sm text-light mt-4"> 
								<span>
                                    Please do not leave this page until the transaction is complete. This may take a few seconds.
								</span>
							</p>
						</>
					)}
				</span>
			</div>
		</div>
	)
}

export default PurchaseLoadingDialog;
