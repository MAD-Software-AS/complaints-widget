import BookingModal from "./domains/Booking/components/BookingModal/BookingModal";
import React from "react";
import Widget from "./features/Widget/Widget";
import WidgetProvider from "./contexts/Widget/WidgetProvider";

interface AppProps {
  chainId: string;
  env: string
  isSection?: boolean
}

const App: React.FC<AppProps> = ({ chainId, env, isSection }) => {
  return (
    <WidgetProvider chainId={chainId} env={env}>
      <Widget isSection={isSection} />
    </WidgetProvider>
  );
};

export default App;
