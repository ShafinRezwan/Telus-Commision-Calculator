import { type Order } from "../types/types";
import "../css/orderlist.css";
interface Props {
  orders: Order[];
  onRemove: (id: string) => void;
}

function OrderList({ orders, onRemove }: Props) {
  return (
    <div className="order-list">
      {orders.map((order) => (
        <div className="order-item" key={order.id}>
          <div className="order-sum">
            <span className="circle-toggle"></span>
            <span className="service">{order.service}</span>
          </div>
          <div className="values">
            <span>$ {order.commission.toFixed(2)}</span>
            <span>SV {order.sv.toFixed(2)}</span>
          </div>
          <button className="x-btn" onClick={() => onRemove(order.id)}>
            X
          </button>
        </div>
      ))}
    </div>
  );
}

export default OrderList;
