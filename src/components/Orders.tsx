import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/orders.css";
import { format } from "date-fns";
import { supabase } from "../types/supaBaseClient";
import { type Order } from "../types/types"; // Your Order interface

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  //total commission calcultation
  const totalsumCommission = orders.reduce((sum: number, order: any) => {
    const orderTotal = order.commissions?.reduce(
      (orderSum: number, c: any) => orderSum + (c.commissionrate?.rate || 0),
      0
    );
    return sum + orderTotal;
  }, 0);

  const totalsumSV = orders.reduce((sum: number, order: any) => {
    const orderSV = order.commissions?.reduce(
      (orderSum: number, c: any) => orderSum + (c.commissionrate?.SV || 0),
      0
    );
    return sum + orderSV;
  }, 0);

  const handlePrevDay = () => {
    setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
  };

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true); // open the picker
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      /*
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      */
      const hardcodedUid = "fea236b9-4f57-45d3-9ade-7266af9b4674";
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
    tid,
    created_at,
    commissions (
      commissionrate (
        display_name,
        rate,
        SV
      )
    )
  `
        )
        .eq("uid", hardcodedUid)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString());

      if (!error) setOrders(data as any);
      else console.error(error);
    };
    fetchOrders();
  }, [selectedDate]);

  return (
    <div className="order-container">
      <div className="pay-container">
        <span id="pay-title">Pay Period</span>
        <div className="pay-period">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MM/dd/yy"
            customInput={
              <span>
                {startDate ? format(startDate, "MM/dd/yy") : "Start Date"}
              </span>
            }
          />
          <span>-</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="MM/dd/yy"
            customInput={
              <span>{endDate ? format(endDate, "MM/dd/yy") : "End Date"}</span>
            }
          />
        </div>
      </div>
      <div className="date_wrapper">
        <button className="arrow" onClick={handlePrevDay}>
          &lt;
        </button>
        {/* Hidden DatePicker, triggered by span click */}
        <DatePicker
          className="current-date"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date as Date)}
          ref={datePickerRef}
          customInput={<span>{selectedDate.toDateString()}</span>}
        />
        <button className="arrow" onClick={handleNextDay}>
          &gt;
        </button>
        {showDatePicker && (
          <div
            style={{
              position: "absolute",
              top: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                if (date) setSelectedDate(date);
                setShowDatePicker(false);
              }}
              inline
            />
          </div>
        )}
      </div>
      <hr className="divider-line" />

      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="no-orders">No orders for the day</p>
        ) : (
          orders.map((order: any) => {
            const services = order.commissions
              ?.map((c: any) => c.commissionrate?.display_name)
              .filter(Boolean)
              .join(" + ");

            const totalCommission = order.commissions
              ?.reduce(
                (sum: number, c: any) => sum + (c.commissionrate?.rate || 0),
                0
              )
              .toFixed(2);

            const totalSV = order.commissions
              ?.reduce(
                (sum: number, c: any) => sum + (c.commissionrate?.SV || 0),
                0
              )
              .toFixed(2);

            return (
              <>
                <div key={order.tid} className="order-entry">
                  <div className="order-service">
                    <span className="services-title">
                      {services || "No Services"}
                    </span>
                  </div>
                  <div className="order-amounts">
                    <p>$ {totalCommission}</p>
                    <p>SV {totalSV}</p>
                  </div>
                </div>
                <span className="border-order"></span>
              </>
            );
          })
        )}
      </div>
      <hr className="divider-line" />
      <div className="total-container">
        <h1 className="total">Total</h1>
        <div className="total-amounts">
          <p>$ {totalsumCommission.toFixed(2)}</p>
          <p>SV {totalsumSV.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;
