import { useEffect, useState } from "react";
import { useAuth } from "../private/context/AuthContext";
import AdminNavbar from "./adminNavbar";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          `https://localhost:3000/api/activitylog/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setLogs(data.logs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLogs();
    } else {
      setError("Unauthorized: Admin token missing.");
      setLoading(false);
    }
  }, [token]);

  const getActionBadgeColor = (action) => {
    const colors = {
      "USER_LOGGED IN": "bg-green-100 text-green-800",
      USER_REGISTER: "bg-gray-100 text-gray-800",
      VERIFY_OTP: "bg-blue-100 text-blue-800",
      RESEND_OTP: "bg-yellow-100 text-yellow-800",
      CANCELLED_ORDER: "bg-red-100 text-red-800",
      USER_FORGETPASSWORD: "bg-purple-100 text-purple-800",
      RESET_PASSWORD: "bg-slate-100 text-purple-800",
      CHANGE_PASSWORD: "bg-slate-100 text-purple-800",
      IMAGE_UPLOAD: "bg-blue-100 text-blue-800",
      CREATED_ORDER: "bg-blue-100 text-blue-800",
      STATUS_UPDATED: "bg-green-100 text-slate-800",
    };

    const upperAction = action?.toUpperCase();
    for (const [key, color] of Object.entries(colors)) {
      if (upperAction?.includes(key)) {
        return color;
      }
    }
    return "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="ml-64 px-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading activity logs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex px-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AdminNavbar />
        <div className="w-full flex-1 overflow-y-auto h-screen bg-white p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Error Loading Logs
              </h3>
              <p className="mt-2 text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminNavbar />
      {logs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Activity Logs
          </h3>
          <p className="text-gray-500">
            There are no activity logs to display at this time.
          </p>
        </div>
      ) : (
        <div className="w-full flex-1 overflow-y-auto h-screen bg-white p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Activity Logs
            </h1>
            <p className="text-gray-600">
              Monitor system activities and user actions
            </p>
          </div>
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activities
              </h2>
              <span className="text-sm text-gray-500">
                {logs.length} total logs
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, index) => (
                  <tr
                    key={log._id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {log.userId && typeof log.userId === "object"
                                ? (log.userId.username ||
                                    log.userId.email ||
                                    log.userId.name ||
                                    "U")[0].toUpperCase()
                                : "S"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {log.userId && typeof log.userId === "object"
                              ? log.userId.username ||
                                log.userId.email ||
                                log.userId.name ||
                                "Unknown User"
                              : "System/Unknown"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {log.ipAddress || (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(log.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
