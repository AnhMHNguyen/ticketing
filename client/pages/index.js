import Link from 'next/link';
import { buildClient } from "../api/build-client";

const Home = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td className="fw-bolder">{ ticket.title }</td>
      <td>{ ticket.price }</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a className="text-decoration-none">View</a>
        </Link>
      </td>
    </tr>
  ))

  return (
    <div className="container">
      <h1>Tickets</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="fs-4">Title</th>
            <th className="fs-4">Price</th>
            <th className="fs-4">Link</th>
          </tr>
        </thead>
        <tbody>
          { ticketList }
        </tbody>
      </table>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { data } = await buildClient(context).get('/api/tickets');

  return {
    props: {
      tickets: data
    }
  }
};


export default Home;