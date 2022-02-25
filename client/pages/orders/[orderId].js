import { useState, useEffect } from "react";
import Router from "next/router";
import { buildClient } from "../../api/build-client";
import { useRequest } from "../../hooks/use-request";
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ currentUser, order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  });
  
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);
  
  return (
    <div className="container mt-5">
      {timeLeft < 0 ? (
        <div>Order Expired</div>
      ) : (
          <div className="vstack gap-3">
            <p>Time left to pay: <strong>{timeLeft}</strong> seconds</p>
            
          <StripeCheckout
              token={({ id }) => doRequest({token: id})}
            stripeKey="pk_test_51JISi2JuJcW9mgpDQp4KHYCHLSYxwr01ik3wbboDSDVxh7kg1NOMAetCinICelOkP8fc63ydLXh2oOlJGpN043Jp00Uq50cBph"
            amount={order.ticket.price * 100}
            email={currentUser.email}
            name='Ticketing Ltd.'
            description={`Your total is $${order.ticket.price}`}
            panelLabel='Pay Now'
            currency='CAD'
            >
              <button className="btn btn-primary">Pay Now</button>
            </StripeCheckout>
            { errors }
        </div>   
      )}
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { orderId } = context.query;
  const { data } = await buildClient(context).get(`/api/orders/${orderId}`);

  return { props: { order: data } };
};

export default OrderShow;