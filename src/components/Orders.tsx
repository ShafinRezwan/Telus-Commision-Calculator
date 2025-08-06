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
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

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
    setSelectedDate((prev) => {
      const newDate = new Date(prev); // Clone
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev); // Clone
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true); // open the picker
    }
  };

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
      cid,
      commissionrate (
        display_name,
        rate,
        SV
      )
    ),
    account_number,
    notes,
    phone_number
  `
      )
      .eq("uid", hardcodedUid)
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());

    if (!error) setOrders(data as any);
    else console.error(error);
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedDate]);

  const handleDelete = async (tid: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order? This cannot be undone."
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("tid", tid);

    if (error) {
      console.error("Failed to delete transaction:", error);
    } else {
      console.log("Transaction deleted successfully");
      setShowModal(false);
      await fetchOrders(); // Refresh the list
    }
  };

  const EditOrderModal = ({
    order,
    onClose,
    onSave,
    onDelete,
  }: {
    order: any;
    onClose: () => void;
    onSave: (updated: any) => void;
    onDelete: (tid: string) => void;
  }) => {
    const [formData, setFormData] = useState({
      notes: order.notes || "",
      account_number: order.account_number || "",
      phone_number: order.phone_number || "",
    });
    const [localCommissions, setLocalCommissions] = useState(
      order.commissions || []
    );
    useEffect(() => {
      setFormData({
        notes: order.notes || "",
        account_number: order.account_number || "",
        phone_number: order.phone_number || "",
      });
      setLocalCommissions(order.commissions || []);
    }, [order]);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRemoveCommission = async (cid: string) => {
      // Remove visually
      setLocalCommissions((prev: any[]) =>
        prev.filter((c: any) => c.cid !== cid)
      );

      // Remove from DB
      const { error } = await supabase
        .from("commissions")
        .delete()
        .eq("cid", cid);
      if (error) {
        console.error("Failed to delete commission:", error);
      }
    };
    const handleSubmit = () => {
      const updatedFields = {
        tid: order.tid,
        notes: formData.notes?.trim() || null,
        account_number: formData.account_number?.trim() || null,
        phone_number: formData.phone_number?.trim() || null,
      };

      onSave(updatedFields); // Only the transaction fields
      onClose();
    };

    const handleOverlayClick = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-content">
          <div className="edit-header">
            <h3>Edit Order</h3>
            <span onClick={onClose} className="back-btn">
              Back
            </span>
          </div>
          <label>Account Number</label>
          <input
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
          />
          <label>Phone Number</label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />

          <label>Services</label>
          <ul className="commissions-list">
            {localCommissions.map((c: any, index: number) => (
              <li key={index} className="commission ">
                {c.commissionrate?.display_name || "Unknown"}
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveCommission(c.cid)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>

          <label>Note</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
          <div className="modal-buttons">
            <button onClick={handleSubmit} className="save-btn">
              Save
            </button>
            <button
              onClick={() => handleDelete(order.tid)}
              className="delete-btn"
            >
              Delete Order
            </button>
          </div>
        </div>
      </div>
    );
  };
  const handleSave = async (updatedFields: any) => {
    const { error } = await supabase
      .from("transactions")
      .update({
        notes: updatedFields.notes,
        phone_number: updatedFields.phone_number,
        account_number: updatedFields.account_number,
      })
      .eq("tid", updatedFields.tid);

    if (error) {
      console.error("Failed to update transaction:", error);
    } else {
      console.log("Update successful");

      await fetchOrders(); // Re-fetch to ensure UI matches DB
    }
  };

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
        <div className="profile">
          <span className="prof">Profile</span>
        </div>
        <div className="date-center">
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
                <div
                  key={order.tid}
                  className="order-entry"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                >
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
      {showModal && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
      <hr className="divider-line" />
      <div className="total-container">
        <div className="leftside-total">
          <h1 className="total">Total</h1>
          <span className="payperiod-commission">
            Commission to date for pay period - ${" "}
            {null ? totalsumCommission : "XXX.XX"}
          </span>
        </div>
        <div className="total-amounts">
          <p>$ {totalsumCommission.toFixed(2)}</p>
          <p>SV {totalsumSV.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;
