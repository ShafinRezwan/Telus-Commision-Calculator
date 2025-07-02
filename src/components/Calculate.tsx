import "../css/calculate.css";
import { useState, type ChangeEvent } from "react";
import { type Order } from "../types/types";
import OrderList from "./OrderList";
import Select, { type MultiValue } from "react-select";

function Calculate() {
  type OptionType = {
    value: string;
    label: string;
  };
  const [orders, setOrders] = useState<Order[]>([]);
  const [service, setService] = useState<OptionType[]>([]);
  const [formData, setFormData] = useState({
    service: "",
    orderNumber: "",
    accountNumber: "",
    phoneNumber: "",
    note: "",
  });

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
        { value: "High Val Tv", label: "High Value" },
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
      label: "Koodo Act",
      options: [
        { value: "Super High Val Act", label: "Super High Value" },
        { value: "High Val Act", label: "High Value" },
        { value: "Mid Val Act", label: "Mid Value" },
        { value: "Low Val Act", label: "Low Value" },
        { value: "Entry Lvl Act", label: "Entry Level" },
        { value: "Connected Device", label: "Connected Device" },
      ],
    },
    {
      label: "Telus Act",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
  /*
  const handleSubmit = () => {
 
    const newOrder: Order = {
      id: crypto.randomUUID(),
      service: formData.service,
      orderNumber: formData.orderNumber,
      accountNumber: formData.accountNumber,
      phoneNumber: formData.phoneNumber,
      note: formData.note,
      commission: 0,
      sv: 0,
    };
    
    setOrders((prev) => [...prev, newOrder]);
  };
  */
  const handleRemove = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const setSelectedServices = (selected: MultiValue<OptionType>) => {
    setService(selected); // ✅ Store the selected services

    const newOrders = selected.map((option) => ({
      id: crypto.randomUUID(),
      service: option.value,
      orderNumber: formData.orderNumber,
      accountNumber: formData.accountNumber,
      phoneNumber: formData.phoneNumber,
      note: formData.note,
      commission: 0,
      sv: 0,
    }));

    setOrders((prev) => [...prev, ...newOrders]);
    setService([]); // ✅ Clear selected options visually
  };

  return (
    <div className="container-calculate">
      <div className="form-container">
        <div className="input-bundle service">
          <label id="service-title">Service </label>
          <div className="select-wrapper">
            <Select<OptionType, true>
              options={options}
              isMulti
              value={service}
              onChange={setSelectedServices}
            />
          </div>
        </div>

        <div className="input-bundle">
          <label htmlFor="order">Order #</label>
          <input
            type="text"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
          />
        </div>

        <div className="input-bundle">
          <label htmlFor="account">Account # </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
          />
        </div>

        <div className="input-bundle">
          <label htmlFor="phone">Phone # </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="order-list">
        <OrderList orders={orders} onRemove={handleRemove} />
      </div>

      <div className="notes-container">
        <div className="input-bundle notes">
          <label htmlFor="notes">Notes </label>
          <input
            type="text"
            name="note"
            className="notes-input"
            value={formData.note}
            onChange={handleChange}
          />
        </div>
        <button className="submit-btn">Submit</button>
      </div>
    </div>
  );
}

export default Calculate;
