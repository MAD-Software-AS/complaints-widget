import { Salon, SalonEmployee } from "../../domains/Salon/Salon.model";
import { useCallback, useEffect, useMemo, useState } from "react";

import getApiUrl from "../../utils/getApiUrl";

export type ChainDayPrice = {
  objectId: string;
  name: string;
  normalPrice: number;
  numberOfDays: number;
  includeWeekends: boolean;
  startTime: string;
  endTime: string;
  discountThreshold: number;
  discountStrength: {
    [key: string]: number;
  };
};

export type SalonAvailability = {
  date: string;
  discountPercent: number;
  discountedPrice: number;
  normalPrice: number;
};

type ChainSalonsState = {
  salons: Salon[];
  employees: Record<string,SalonEmployee[]>;
  termsAndConditions: ChainTermsAndConditions | null;
  loading: boolean;
  error: Error | null;
};

export type ChainTermsAndConditions = {
  objectId: string;
  paragraphs: {
    id: number;
    value: string;
  }[];
};

const INITIAL_STATE: ChainSalonsState = {
  salons: [],
  employees: {},
  termsAndConditions: null,
  loading: true,
  error: null,
};

const useGetWidgetContextData = (
  chainId: string,
  setSelectedSalon: React.Dispatch<React.SetStateAction<string | null>>,
  env: string
) => {
  const [state, setState] = useState(INITIAL_STATE);

  const loadSalons = useCallback(async () => {
    try {
      const reponse = await fetch(
        `${getApiUrl(env)}/chains/complaints-form-info/${chainId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const responseData = await reponse.json();
      setState({
        salons: responseData.salons,
        employees: responseData.employees,
        termsAndConditions: responseData.termsAndConditions,
        error: null,
        loading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error as Error }));
    }
  }, [chainId]);

  useEffect(() => {
    loadSalons();
  }, [loadSalons]);

  return useMemo(() => ({ ...state }), [state]);
};

export default useGetWidgetContextData;
