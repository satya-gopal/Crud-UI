import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserCog } from "lucide-react";
import toast from "react-hot-toast";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface ErrorMessage {
  key: string;
  message: string;
}

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorMessage[]>([
    { key: "firstname", message: "" },
    { key: "lastname", message: "" },
    { key: "email", message: "" },
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://reqres.in/api/users/${id}`);

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setUser({
          id: data.data.id,
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          email: data.data.email,
        });
      } catch (error) {
        toast.error("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasErrors = false;

    if (!user.first_name) {
      setErrors((prevErrors) =>
        prevErrors.map((err) =>
          err.key === "firstname" ? { ...err, message: "First Name is required" } : err
        )
      );
      hasErrors = true;
    }

    if (!user.last_name) {
      setErrors((prevErrors) =>
        prevErrors.map((err) =>
          err.key === "lastname" ? { ...err, message: "Last Name is required" } : err
        )
      );
      hasErrors = true;
    }

    if (!user.email) {
      setErrors((prevErrors) =>
        prevErrors.map((err) =>
          err.key === "email" ? { ...err, message: "Email is required" } : err
        )
      );
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      setLoading(true);
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        }),
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("User updated successfully");
        navigate("/users");
      } else {
        toast.error("Error updating user");
      }
    } catch (error) {
      toast.error("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/users")}
          disabled={loading}
          className="flex items-center mb-6 text-violet-600 hover:text-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to Users</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <UserCog className="w-10 h-10 text-violet-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit User Profile</h1>
              <p className="text-gray-600 mt-1">Update user information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={user.first_name}
                  onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.find(err => err.key === "firstname")?.message && (
                  <p className="text-red-500 text-sm">{errors.find(err => err.key === "firstname")?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={user.last_name}
                  onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.find(err => err.key === "lastname")?.message && (
                  <p className="text-red-500 text-sm">{errors.find(err => err.key === "lastname")?.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.find(err => err.key === "email")?.message && (
                  <p className="text-red-500 text-sm">{errors.find(err => err.key === "email")?.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/users")}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2 border border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;