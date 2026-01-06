import { WalletProvider } from "../../../components/wallet/wallet-provider";
import { AlertProvider } from "../../../contexts/AlertContext";
import { FulfillerLayout } from "../layout";
import { FulfillerPayment } from "./view";

export const FulfillerPaymentPage = () => {
  return (
    <FulfillerLayout>
      <AlertProvider>
        <WalletProvider>
          <FulfillerPayment />
        </WalletProvider>
      </AlertProvider>
    </FulfillerLayout>
  );
};
