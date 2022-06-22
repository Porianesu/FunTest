import { useLocation, useNavigate, useParams } from "react-router";
import { deleteInvoice, getInvoice } from "@/routes/data";

export default function Invoice() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const invoice = getInvoice(parseInt(params.invoiceId as string, 10));
  return invoice ? (
    <main style={{ padding: "1rem" }}>
      <h2>Total Due: {invoice.amount}</h2>
      <p>
        {invoice.name}: {invoice.number}
      </p>
      <p>Due Date: {invoice.due}</p>
      <p>
        <button
          onClick={() => {
            deleteInvoice(invoice.number);
            navigate("/invoices" + location.search);
          }}
        >
          Delete
        </button>
      </p>
    </main>
  ) : null;
}
