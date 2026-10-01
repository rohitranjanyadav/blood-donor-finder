import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AuthBrandPanel from "../components/auth/AuthBrandPanel";
import AuthForm from "../components/auth/AuthForm";
import HospitalPendingScreen from "../components/auth/HospitalPendingScreen";
import { roleRedirect } from "../components/auth/authConfig";

const initialForm = {
  email: "",
  password: "",
  confirm_password: "",
  full_name: "",
  phone: "",
  address: "",
  blood_group: "",
  hospital_name: "",
  license_no: "",
};

function getPathRole() {
  const path = window.location.pathname;

  if (path.includes("donor")) return "donor";
  if (path.includes("patient")) return "patient";
  if (path.includes("hospital")) return "hospital";
  return null;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const pathRole = getPathRole();
  const view = pathRole ? "register" : "login";

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(pathRole || "donor");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [hospitalPending, setHospitalPending] = useState(false);
  const [donorCount, setDonorCount] = useState(0);
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const selectBloodGroup = (bloodGroup) => {
    setForm((currentForm) => ({ ...currentForm, blood_group: bloodGroup }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (view === "register" && form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    if (view === "register" && selectedRole === "donor" && !form.blood_group) {
      setError("Select your blood group");
      return;
    }

    setLoading(true);
    try {
      if (view === "login") {
        const { data } = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        login(data.user, data.token);
        setSuccess(true);
        setTimeout(() => navigate(roleRedirect[data.user.role] || "/"), 800);
        return;
      }

      const payload = buildRegistrationPayload(selectedRole, form);
      const { data } = await api.post(
        `/auth/register/${selectedRole}`,
        payload,
      );

      if (selectedRole === "hospital") {
        setHospitalPending(true);
      } else {
        login(data.user, data.token);
        setSuccess(true);
        setTimeout(() => navigate(roleRedirect[selectedRole]), 800);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    api
      .get("/donors/count")
      .then(({ data }) => {
        if (!cancelled) setDonorCount(data.total);
      })
      .catch(() => {
        if (!cancelled) setDonorCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (hospitalPending) return <HospitalPendingScreen />;

  return (
    <div
      className="min-h-screen bg-gray-50 flex"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <AuthBrandPanel view={view} donors={donorCount} />

      <main className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-14 xl:px-20">
        <div className="max-w-md w-full mx-auto">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700
                       mb-8 lg:hidden text-sm no-underline"
          >
            <ArrowLeft size={13} /> Back
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {view === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {view === "login" ? "No account? " : "Already registered? "}
            <Link
              to={view === "login" ? "/register/donor" : "/login"}
              className="text-red-600 font-semibold hover:underline no-underline"
            >
              {view === "login" ? "Register here" : "Sign in"}
            </Link>
          </p>

          {success ? (
            <div className="flex flex-col items-center py-14">
              <CheckCircle2 size={52} className="text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {view === "login" ? "Signed in" : "Account created"}
              </h3>
              <p className="text-gray-500 text-sm">
                Taking you to your dashboard...
              </p>
            </div>
          ) : (
            <AuthForm
              view={view}
              pathRole={pathRole}
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
              form={form}
              onChange={handleChange}
              onBloodGroupSelect={selectBloodGroup}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((visible) => !visible)}
              error={error}
              loading={loading}
              onSubmit={submit}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function buildRegistrationPayload(role, form) {
  const commonFields = {
    email: form.email,
    password: form.password,
    phone: form.phone,
  };

  if (role === "donor") {
    return {
      ...commonFields,
      full_name: form.full_name,
      blood_group: form.blood_group,
      address: form.address,
    };
  }

  if (role === "patient") {
    return { ...commonFields, full_name: form.full_name };
  }

  return {
    ...commonFields,
    hospital_name: form.hospital_name,
    address: form.address,
    license_no: form.license_no,
  };
}
