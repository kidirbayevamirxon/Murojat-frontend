import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/api";
import AddOrganizationDrawer from "./AddOrganization";
import EditOrganizationDrawer from "./OrganizationEdit";
import DeleteOrganizationDrawer from "./OrganizationDelete";

interface Organization {
  id: number;
  name: string;
  createdAt?: string;
}

const OrganizationsTable: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<{ id: number; name: string } | null>(null);

  const fetchOrganizations = () => {
    axiosInstance
      .get("/organization/organization", { params: { page } })
      .then((response) => {
        console.log("Organizations:", response.data);
        const data = response.data.items || [];
        setOrganizations(data);
        setPagination(response.data.pagination);
      })
      .catch((error) => {
        console.error("There was an error fetching the organizations!", error);
      });
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center pb-3">
        <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
        <div className="flex items-center gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setDrawerOpen(true)}
          >
            <span>+</span> Add Organization
          </button>
        </div>
      </div>

      <div className="w-full left-0">
        <hr className="border-t border-gray-300" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left text-xs uppercase font-semibold text-gray-600">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900">{org.name}</td>
                <td className="py-3 px-4 text-gray-600">{org.createdAt || "—"}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      className="text-red-600 hover:text-red-800 text-sm"
                      onClick={() => {
                        setSelectedOrg(org);
                        setDeleteOpen(true);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      onClick={() => {
                        setSelectedOrg(org);
                        setEditOpen(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {organizations.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-6 italic">
                  No organizations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            disabled={page >= pagination.total_pages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      <AddOrganizationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdded={fetchOrganizations}
      />

      {selectedOrg && (
        <EditOrganizationDrawer
          open={editOpen}
          onClose={() => setEditOpen(false)}
          orgId={selectedOrg.id}
          currentName={selectedOrg.name}
          onUpdated={fetchOrganizations}
        />
      )}
       {selectedOrg && (
        <DeleteOrganizationDrawer
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          orgId={selectedOrg.id}
          orgName={selectedOrg.name}
          onDeleted={fetchOrganizations}
        />
      )}
    </div>
  );
};

export default OrganizationsTable;
