import "./tickets.css";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Filters = {
  [key: string]: string;
};

function Tickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: "",
    severity: "",
    assignedTo: "",
    status: "",
  });
  const [sort, setSort] = useState("createdAt"); // default sort
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const updateFilters = (fieldName: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [fieldName]: value,
    }));
    console.log(filters);
  };

  const applyFilters = async () => {
    let query: Record<string, string> = {};

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.severity) {
      query.severity = filters.severity;
    }

    if (filters.assignedTo) {
      query.assignedTo = filters.assignedTo;
    }

    if (filters.status) {
      query.status = filters.status;
    }
    const urlQuery = new URLSearchParams(query).toString();
    try {
      const response = await fetch(
        "http://165.232.180.63:4000/api/support-tickets?" + urlQuery,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const apiResponse = await response.json();
      setTickets(apiResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  async function fetchTickets() {
    const response = await fetch(
      `http://165.232.180.63:4000/api/support-tickets?sort=${sort}&page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const apiResponse = await response.json();
    setTickets(apiResponse.data);
  }

  useEffect(() => {
    fetchTickets();
  }, [sort, page, pageSize]);

  function assignTicket(_id: any) {
    return async () => {
      try {
        const response = await fetch(
          `http://165.232.180.63:4000/api/support-tickets/${_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );
        const apiResponse = await response.json();
        if (apiResponse.status === 200) {
          toast.success("Ticket assigned successfully");
          fetchTickets();
        } else if (apiResponse.status === 400) {
          toast.error(apiResponse.error);
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
  }

  function resolveTicket(id: any) {
    return async () => {
      try {
        const response = await fetch(
          `http://165.232.180.63:4000/api/support-tickets/${id}/resolve`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );
        const apiResponse = await response.json();
        if (apiResponse.status === 200) {
          toast.success("Ticket resolved successfully");
          fetchTickets();
        } else if (apiResponse.status === 400) {
          toast.error(apiResponse.error);
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center w-full bg-black font-sans text-white">
      <div className="flex flex-col justify-between p-4 h-4/5 w-11/12 sm:w-10/12 md:w-9/12 lg:w-4/5 xl:w-3/4 2xl:w-2/3 my-6 overflow-auto bg-gray-800 rounded-lg shadow-xl">
        <div className="mb-4 flex flex-wrap justify-between p-4 flex-1/2">
          <input
            type="text"
            placeholder="Filter by Type"
            value={filters.type}
            onChange={(e) => updateFilters("type", e.target.value)}
            className="rounded p-1 text-black"
          />
          <input
            type="text"
            placeholder="Filter by Severity"
            value={filters.severity}
            onChange={(e) => updateFilters("severity", e.target.value)}
            className="rounded p-1 text-black"
          />
          <input
            type="text"
            placeholder="Filter by Assigned To"
            value={filters.assignedTo}
            onChange={(e) => updateFilters("assignedTo", e.target.value)}
            className="rounded p-1 text-black"
          />
          <input
            type="text"
            placeholder="Filter by Status"
            value={filters.status}
            onChange={(e) => updateFilters("status", e.target.value)}
            className="rounded p-1 text-black"
          />
          <button
            onClick={applyFilters}
            className="button-style bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition ease-in duration-200"
          >
            Apply Filters
          </button>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full text-white">
            <thead>
              <tr>
                <>
                  <th className="px-4 py-2 text-left">Topic</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Severity</th>
                  <th className="px-4 py-2 text-left">Assigned</th>
                  <th
                    className="px-4 py-2 text-left"
                    onClick={() => setSort("createdAt")}
                  >
                    Created
                  </th>
                  <th
                    className="px-4 py-2 text-left"
                    onClick={() => setSort("resolvedAt")}
                  >
                    Resolved
                  </th>
                  <th className="px-4 py-2 text-left">Action</th>
                </>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td className="px-4 py-2 text-center">No Agents</td>
                </tr>
              ) : (
                tickets.length > 0 &&
                tickets.map((ticket, index) => (
                  <>
                    <tr key={index} className="lg:mx-8">
                      <td className="px-4 py-2 text-left">{ticket.topic}</td>
                      <td className="px-4 py-2 text-left">{ticket.type}</td>
                      <td className="px-4 py-2 text-left">{ticket.status}</td>
                      <td className="px-4 py-2 text-left">{ticket.severity}</td>
                      <td className="px-4 py-2 text-left">
                        {ticket.assignedTo == null ? "-" : ticket.assignedTo}
                      </td>
                      <td className="px-4 py-2 text-left">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-left">
                        {ticket.resolvedAt == null ? "-" : new Date(ticket.resolvedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-left">
                        {ticket.assignedTo == null && (
                          <button
                            onClick={assignTicket(ticket._id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-1 px-2 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                          >
                            Assign
                          </button>
                        )}
                        {ticket.assignedTo != null &&
                          ticket.resolvedAt == null && (
                            <button
                              onClick={resolveTicket(ticket._id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-1 px-2 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                            >
                              Resolve
                            </button>
                          )}
                        {ticket.assignedTo != null &&
                          ticket.resolvedAt != null && (
                            <p className="text-green-500 text-xs sm:text-sm italic">
                              Completed
                            </p>
                          )}
                      </td>
                    </tr>
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center my-4 flex-1/2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="mx-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300"
          >
            {/* Replace text with arrow icons */}
            <i className="fas fa-arrow-left"></i>
          </button>

          {/* Enhance page number display */}
          <span className="mx-2 text-lg text-gray-300 font-semibold">
            Page {page}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            className="mx-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Tickets;
