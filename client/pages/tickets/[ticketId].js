import { buildClient } from "../../api/build-client";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket }) => { 
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
  })
  return (
    <div className="container">
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      { errors }
      <button className="btn btn-primary" onClick={() => doRequest()}>Purchase</button>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { ticketId } = context.query;
  const { data } = await buildClient(context).get(`/api/tickets/${ticketId}`);

  return { props: { ticket: data } };
};

export default TicketShow;