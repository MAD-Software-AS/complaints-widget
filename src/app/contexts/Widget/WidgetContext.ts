import { ChainDayPrice, ChainTermsAndConditions, SalonAvailability } from "./useGetWidgetContextData";
import { Salon, SalonEmployee } from "../../domains/Salon/Salon.model";

import { createContext } from "react";

interface WidgetContextValues {
  salons?: Salon[];
  chainDayPrice?: ChainDayPrice | null;
  availabilities?: {
    [key: string]: SalonAvailability[];
  };
  termsAndConditions?: ChainTermsAndConditions | null
  selectedSalon?: string | null;
  setSelectedSalon?: React.Dispatch<React.SetStateAction<string | null>>;
  isBookingModalOpened: boolean;
  setIsBookingModalOpened?: React.Dispatch<React.SetStateAction<boolean>>;
  bookingModalContext?: {
    date: string;
    price: number;
    startTime: string;
    endTime: string;
  } | null;
  setBookingModalContext?: React.Dispatch<
    React.SetStateAction<{
      date: string;
      price: number;
      startTime: string;
      endTime: string;
    } | null>
  >;
  loading: boolean;
  employees?: Record<string,SalonEmployee[]>
  env: string
}

const WidgetContext = createContext<WidgetContextValues>({
  loading: true,
  isBookingModalOpened: false,
  env: 'dev'
});

export default WidgetContext;
