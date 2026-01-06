import { WalletProvider } from "../../../components/wallet/wallet-provider";
import { AlertProvider } from "../../../contexts/AlertContext";
import { ClientLayout } from "../layout";
import { ClientPayment } from "./view";

export const ClientPaymentPage = () => {
  return (
    <ClientLayout>
      <AlertProvider>
        <WalletProvider>
          <ClientPayment />
        </WalletProvider>
      </AlertProvider>
    </ClientLayout>
  );
};
