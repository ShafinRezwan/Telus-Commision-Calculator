import "../css/calculate.css";
import { useState, useEffect } from "react";
import { type Order } from "../types/types";
import OrderList from "./OrderList";
import Select, { type MultiValue } from "react-select";
//import { getCommissionRateByName } from "../types/getCommissionRate";
import { supabase } from "../types/supaBaseClient";
import type { User } from "@supabase/supabase-js";

function Calculate() {
  type OptionType = {
    value: string;
    label: string;
    sv: number;
    rate: number;
    category: string;
  };

  type GroupedOption = {
    label: string;
    options: OptionType[];
  };
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error.message);
        return;
      }
      setUser(data.user);
    };

    fetchUser();
  }, []);

  const [orders, setOrders] = useState<Order[]>([]);
  const [service, setService] = useState<MultiValue<OptionType>>([]);
  const [formData, setFormData] = useState({
    service: "",
    orderNumber: "",
    accountNumber: "",
    phoneNumber: "",
    note: "",
  });

  const [options, setOptions] = useState<GroupedOption[]>([]);
  useEffect(() => {
    const fetchOptions = async () => {
      const { data, error } = await supabase
        .from("commissionrate") // or your actual table name
        .select("name, display_name, SV, rate, category_name");

      if (error) {
        console.error("Failed to fetch options:", error.message);
        return;
      }
      //console.log("Fetched options:", data);

      // Dynamically group by category_name
      const groupedMap: Record<string, OptionType[]> = {};

      data.forEach((item) => {
        const category = item.category_name || "Uncategorized";
        if (!groupedMap[category]) {
          groupedMap[category] = [];
        }

        groupedMap[category].push({
          value: item.display_name,
          label: item.display_name,
          sv: item.SV,
          rate: item.rate,
          category: category,
        });
      });
      // Grouping example — you'll need logic based on naming
      const grouped: GroupedOption[] = Object.keys(groupedMap).map(
        (category) => ({
          label: category,
          options: groupedMap[category],
        })
      );

      setOptions(grouped);
    };

    fetchOptions();
  }, []);
  /*
  const options = [
    {
      label: "Internet",
      options: [
        { value: "High Val Int", label: "High Value" },
        { value: "Mid Val Int", label: "Mid Value" },
        { value: "Low Val Int", label: "Low Value" },
      ],
    },
    {
      label: "TV",
      options: [
        { value: "TV High", label: "High Value" },
        { value: "Mid Val Tv", label: "Mid Value" },
        { value: "Low Val Tv", label: "Low Value" },
      ],
    },
    {
      label: "Security",
      options: [
        { value: "Control +", label: "Control Plus" },
        { value: "Automation +", label: "Automation Plus" },
        { value: "HomeView", label: "HomeView" },
        { value: "Smart Enery", label: "Smart Energy" },
      ],
    },
    {
      label: "Activation",
      options: [
        { value: "Super High Val Act", label: "Super High Value" },
        { value: "High Val Act", label: "High Value" },
        { value: "Mid Val Act", label: "Mid Value" },
        { value: "Low Val Act", label: "Low Value" },
        { value: "Entry Lvl Act", label: "Entry Level" },
        { value: "Connected Device", label: "Connected Device" },
      ],
    },
  ];
*/
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  /*
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedService = e.target.value;
    if (!selectedService) return;

    const newOrder: Order = {
      id: crypto.randomUUID(),
      service: selectedService,
      orderNumber: "XXX", // You can replace with real logic
      accountNumber: "XXX",
      phoneNumber: "XXX",
      commission: 0,
      sv: 0,
    };

    setOrders((prev) => [...prev, newOrder]);
    // Reset only the service dropdown
    setFormData((prev) => ({ ...prev, service: "" }));
  };
  */
  const [commissionRates, setCommissionRates] = useState<any[]>([]); // raw commission rate records

  useEffect(() => {
    const fetchOptions = async () => {
      const { data, error } = await supabase
        .from("commissionrate")
        .select("crid, name, display_name, SV, rate, category_name");

      if (error) {
        console.error("Failed to fetch options:", error.message);
        return;
      }

      setCommissionRates(data); // <-- store the full commission rate data

      // (your existing grouping code for the Select dropdown)
    };

    fetchOptions();
  }, []);

  const handleSubmit = async () => {
    //console.log(orders);
    console.log(user?.id);
    try {
      const { data, error } = await supabase
        .from("transactions")
        .upsert({
          uid: user?.id,
          notes: formData.note,
          phone_number: formData.phoneNumber,
          order_number: formData.orderNumber,
          account_number: formData.accountNumber,
        })
        .select();
      /*
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
  
            notes: formData.note,
            phone_number: formData.phoneNumber,
            //created_at: new Date()
          },
        ])
        .select();
        */
      if (error) {
        console.error("Error inserting transaction:", error);
        return;
      }
      console.log("Inserted Transaction:", data);

      // Insert related Commissions

      const commissionsPayload = orders.map((order) => {
        const matchingRate = commissionRates.find(
          (rate) => rate.display_name === order.service
        );
        return {
          tid: data?.[0]?.tid,
          commission_type: matchingRate?.crid, // <-- store the id
        };
      });

      console.log("Commissions to insert:", commissionsPayload);

      const { error: commissionsError } = await supabase
        .from("commissions")
        .insert(commissionsPayload);
      if (commissionsError) {
        console.error("Error inserting commissions:", commissionsError);
        return;
      }

      console.log("Successfully submitted transaction and commissions");
      // Reset form and orders
      setFormData({
        service: "",
        orderNumber: "",
        accountNumber: "",
        phoneNumber: "",
        note: "",
      });
      setOrders([]);
      setService([]);
    } catch (err) {
      console.error("Unexpected error submitting data:", err);
    }
  };

  const handleRemove = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const setSelectedServices = async (selected: MultiValue<OptionType>) => {
    setService(selected); //  Store the selected services

    const newOrders = selected.map((option) => ({
      id: crypto.randomUUID(),
      service: option.value,
      orderNumber: formData.orderNumber ?? "",
      accountNumber: formData.accountNumber ?? "",
      phoneNumber: formData.phoneNumber ?? "",
      note: formData.note ?? "",
      commission: option.rate,
      sv: option.sv,
    })) as Order[];

    setOrders((prev) => [...prev, ...newOrders]);
    setService([]); // clear select box
  };
  const totalCommission = orders.reduce(
    (sum, order) => sum + order.commission,
    0
  );
  const totalSV = orders.reduce((sum, order) => sum + order.sv, 0);

  const colourStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
      border: "2px solid #2b8000",
      borderRadius: "8px",
      width: `13vw`,
      height: "7vh",
    }),
  };

  return (
    <div className="container-calculate">
      <div className="form-container">
        <div className="input-bundle service">
          <label id="service-title">Service </label>
          <div className="select-wrapper">
            <Select
              options={options}
              value={service}
              onChange={setSelectedServices}
              styles={colourStyles}
              isMulti
            />
          </div>
        </div>

        <div className="input-bundle">
          <label htmlFor="order">Order #</label>
          <input
            type="number"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
          />
        </div>

        <div className="input-bundle">
          <label htmlFor="account">Account # </label>
          <input
            type="number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
          />
        </div>

        <div className="input-bundle">
          <label htmlFor="phone">Phone # </label>
          <input
            type="number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="order-list">
        <OrderList orders={orders} onRemove={handleRemove} />
      </div>
      <div className="total-calc">
        <span>
          {totalCommission === 0 ? "" : `$ ${totalCommission.toFixed(2)}`}
        </span>
        <span> {totalSV === 0 ? "" : `SV ${totalSV.toFixed(2)}`}</span>
      </div>

      <div className="notes-container">
        <div className="input-bundle notes">
          <label htmlFor="notes">Notes </label>
          <textarea
            name="note"
            className="notes-input"
            value={formData.note}
            onChange={handleChange}
            rows={8}
            cols={40}
          />
        </div>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={orders.length === 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Calculate;
