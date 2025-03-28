import React, { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Edit2, Trash2, Users, Search, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { DeleteDialog } from "../components/core/DeleteDialog";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface PaginationData {
  per_page?: number;
  total_pages?: number;
  page?: number;
  total?: number;
}

const UserList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<User[]>([]);
  const [originalData, setOriginalData] = useState<User[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [paginationData, setPaginationData] = useState<PaginationData>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  const page = Number(searchParams.get("page")) || 1;

  const fetchUsers = async (page: number) => {
    try {
      const response = await fetch(`https://reqres.in/api/users?page=${page}`);
      const data = await response.json();
      setPaginationData(data);
      setOriginalData(data.data || []);
      return data.data || [];
    } catch (error) {
      toast.error("Error fetching users");
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return data.filter(user => 
      user.first_name.toLowerCase().includes(lowercasedSearch) ||
      user.last_name.toLowerCase().includes(lowercasedSearch) ||
      user.email.toLowerCase().includes(lowercasedSearch) ||
      user.id.toString().includes(searchTerm)
    );
  }, [data, searchTerm]);

  const deleteEmployeeById = async () => {
    if (deleteLoading) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`https://reqres.in/api/users/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 || response.status === 201) { 
        toast.success("User deleted successfully!");
        fetchUsers(page);
        setDeleteId("");
      } else if (response.status === 404) {
        toast.error("Employee not found");
      } else if (response.status === 204) {
        toast.error("Getting Error 204 while deleting employee");
      } else {
        toast.error("Failed to delete employee");
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleClose = () => {
    setDeleteId("");
  };

  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => <span className="font-medium">#{info.getValue()}</span>,
    }),
    columnHelper.accessor("avatar", {
      header: "Avatar",
      cell: (info) => (
        <img
          src={info.getValue()}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    }),
    columnHelper.accessor("first_name", {
      header: "First Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("last_name", {
      header: "Last Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => (
        <span className="text-gray-600 hidden md:table-cell">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (props) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/users/edit/${props.row.original.id}`)}
            className="p-1 text-violet-600 hover:bg-violet-50 rounded-full transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(props.row.original.id.toString())}
            className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: paginationData?.per_page || 6 } },
  });

  const changePage = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const generatePagination = () => {
    const pages = [];
    if (paginationData?.total_pages ?? 0 <= 5) {
      for (let i = 1; i <= (paginationData.total_pages || 0); i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(paginationData?.total_pages ?? 0 - 1, page + 1); i++) pages.push(i);
      if (paginationData.total_pages && page < paginationData.total_pages - 2) pages.push("...");
      pages.push(paginationData?.total_pages);
    }
    return pages;
  };

  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers(page);
      setData(users);
    };
    loadUsers();
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar userEmail="eve.holt@reqres.in" userName="Admin" />
      </div>

      <div className="flex-1 pt-16 p-4 md:px-8">
        <div className="rounded-xl shadow-lg bg-white h-full flex flex-col">
          <div className="p-4 md:p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-violet-600 mr-3" />
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    User Management
                  </h1>
                  <p className="text-sm md:text-base text-gray-600 mt-1">Manage your system users</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/users/add")}
                className="flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>

            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-violet-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-violet-50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-4 md:px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No users found matching your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="border-t p-4 flex flex-wrap items-center justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => changePage(page - 1)}
              className="flex items-center px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </button>
            
            <div className="flex flex-wrap gap-2">
              {generatePagination().map((p, index) => (
                <button
                  key={index}
                  onClick={() => typeof p === "number" && changePage(p)}
                  disabled={p === "..."}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    p === page
                      ? "bg-violet-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  } ${p === "..." ? "cursor-default" : ""}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              disabled={page === paginationData?.total_pages}
              onClick={() => changePage(page + 1)}
              className="flex items-center px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      <DeleteDialog
        openOrNot={!!deleteId}
        onCancelClick={handleClose}
        label="Are you sure you want to delete this Employee Data?"
        onOKClick={deleteEmployeeById}
        deleteLoading={deleteLoading}
      />
    </div>
  );
};

export default UserList;