import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocalDatabase } from "./databaseContext";

type OrderContextType = {
  baseCost: number;
  temporaryImageId: number;
  watermarkCollage: string;
  quantity: number;
  shippingCost: number;
  tax: number;
  formData: string[];
  setBaseCost: (value: number) => Promise<void>;
  setTemporaryImageId: (value: number) => Promise<void>;
  setWatermarkCollage: (value: string) => Promise<void>;
  setQuantity: (value: number) => Promise<void>;
  setShippingCost: (value: number) => Promise<void>;
  setTax: (value: number) => Promise<void>;
  setFormData: (value: string[]) => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { setVariable, loadVariable } = useLocalDatabase();

  const [baseCost, setBaseCostState] = useState<number>(0);
  const [temporaryImageId, setTemporaryImageIdState] = useState<number>(0);
  const [watermarkCollage, setWatermarkCollageState] = useState<string>("");
  const [quantity, setQuantityState] = useState<number>(1);
  const [shippingCost, setShippingCostState] = useState<number>(0);
  const [tax, setTaxState] = useState<number>(0);
  const [formData, setFormDataState] = useState<string[]>([]);

  const setBaseCost = async (value: number) => {
    await setVariable("baseCost", value);
    setBaseCostState(value);
  };

  const setTemporaryImageId = async (value: number) => {
    await setVariable("temporaryImageId", value);
    setTemporaryImageIdState(value);
  };

  const setWatermarkCollage = async (value: string) => {
    await setVariable("watermarkCollage", value);
    setWatermarkCollageState(value);
  };

  const setQuantity = async (value: number) => {
    await setVariable("quantity", value);
    setQuantityState(value);
  };

  const setShippingCost = async (value: number) => {
    await setVariable("shippingCost", value);
    setShippingCostState(value);
  };

  const setTax = async (value: number) => {
    await setVariable("tax", value);
    setTaxState(value);
  };

  const setFormData = async (value: string[]) => {
    await setVariable("formData", value);
    setFormDataState(value);
  };

  useEffect(() => {
    const initializeState = async () => {
        try {
            setBaseCostState(await loadVariable("baseCost"));
        } catch {
            setBaseCostState(0);
        }

        try {
            setTemporaryImageIdState(await loadVariable("temporaryImageId"));
        } catch {
            setTemporaryImageIdState(0);
        }

        try {
            setWatermarkCollageState(await loadVariable("watermarkCollage"));
        } catch {
            setWatermarkCollageState("");
        }

        try {
            setQuantityState(await loadVariable("quantity"));
        } catch {
            setQuantityState(1);
        }

        try {
            setShippingCostState(await loadVariable("shippingCost"));
        } catch {
            setShippingCostState(0);
        }

        try {
            setTaxState(await loadVariable("tax"));
        } catch {
            setTaxState(0);
        }

        try {
            setFormDataState(await loadVariable("formData"));
        } catch {
            setFormDataState([]);
        }
    };

    initializeState();
  }, [loadVariable]);

  return (
    <OrderContext.Provider
      value={{
        baseCost,
        temporaryImageId,
        watermarkCollage,
        quantity,
        shippingCost,
        tax,
        formData,
        setBaseCost,
        setTemporaryImageId,
        setWatermarkCollage,
        setQuantity,
        setShippingCost,
        setTax,
        setFormData,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
