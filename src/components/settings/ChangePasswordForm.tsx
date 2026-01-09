import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/contexts/AlertContext";

interface ChangePasswordFormProps {
  defaultEmail?: string;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ defaultEmail}) => {
  const { changePassword } = useAuth();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        email: formData.email,
        password: formData.password,
        newPassword: formData.newPassword,
      });
      showAlert("success", "Password changed successfully");
      setFormData((prev) => ({
        ...prev,
        password: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Change password failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData((prev) => ({
        ...prev,
        email: defaultEmail || "",
    }));
  }, [defaultEmail]);

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4">
        {!defaultEmail && <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
            Current Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            placeholder="Enter your current password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            placeholder="Enter your new password"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      {error ? <div className="text-red-400 text-sm text-center">{error}</div> : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-lg font-medium text-gray-200 bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 disabled:opacity-50 transition-colors duration-200"
        >
          {isLoading ? "Changing Password..." : "Change Password"}
        </button>
      </div>
    </form>
  );
};
