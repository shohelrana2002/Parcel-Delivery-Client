// ForbiddenAccess.jsx
import React from "react";
import { useNavigate } from "react-router";
import { AlertTriangle } from "lucide-react";
import { FiHome, FiMail } from "react-icons/fi";

const ForbiddenAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left: Illustration / icon */}
          <div className="md:w-1/2 bg-red-50 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto w-36 h-36 rounded-full bg-red-100 flex items-center justify-center shadow-inner">
                <AlertTriangle className="w-20 h-20 text-red-600" />
              </div>
              <p className="mt-6 text-sm text-red-500 font-medium">403</p>
            </div>
          </div>

          {/* Right: Text and actions */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Oops — Access Denied
            </h1>

            <p className="mt-3 text-gray-600">
              You don’t have permission to view this page. If you think this is
              a mistake, please contact the administrator or request access.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• Check that you are logged in with the correct account.</li>
              <li>
                • If you’re supposed to have access, contact an admin to grant
                permission.
              </li>
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/")}
                className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
                aria-label="Go home"
              >
                <FiHome className="w-4 h-4" />
                Go to Home
              </button>

              <a
                href="mailto:support@example.com?subject=Access%20Request%20-%20Forbidden%20Page"
                className="btn btn-outline flex items-center gap-2 w-full sm:w-auto justify-center"
                aria-label="Contact support"
              >
                <FiMail className="w-4 h-4" />
                Contact Support
              </a>
            </div>

            <div className="mt-6 text-xs text-gray-400">
              <strong>Tip:</strong> Admin users can change roles from the Make
              Admin panel.
            </div>
          </div>
        </div>
      </div>

      {/* small footer note for mobile */}
      <div className="absolute bottom-6 text-xs text-gray-400">
        If you are an admin and see this unexpectedly, try re-logging or check
        your role.
      </div>
    </div>
  );
};

export default ForbiddenAccess;
