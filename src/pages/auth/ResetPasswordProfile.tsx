import { useNavigate } from "react-router-dom";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { useAuth } from "@/hooks/useAuth";

export default function ResetPasswordProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="h-[100vh] overflow-auto flex items-center justify-center bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full min-w-[500px] rounded-[14px] max-w-sm sm:max-w-md space-y-6 sm:space-y-8 border border-gray-700 p-16">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-200 text-center">
            Reset Your Password
          </h2>
        </div>
        <ChangePasswordForm
          defaultEmail={user?.email || ""}
        />
      </div>
    </div>
  );
}
