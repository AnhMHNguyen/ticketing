import { buildClient } from "../../api/build-client";

const OrderIndex = ({ orders }) => {
  return (
    <div className="container mt-4">
      <h2>My Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.ticket.title} - { order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { data } = await buildClient(context).get('/api/orders');

  return { props: { orders: data } };
};

export default OrderIndex;