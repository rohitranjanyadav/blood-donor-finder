import { AlertCircle, Eye, EyeOff } from "lucide-react";
import RoleSelector from "./RoleSelector";
import { BLOOD_GROUPS } from "./authConfig";

const inputClassName = `w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                         text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20
                         focus:border-red-400 transition-all`;

function TextField({ label, name, value, onChange, placeholder, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClassName}
        {...props}
      />
    </div>
  );
}

function PasswordField({ showPassword, onToggle, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Min. 8 characters"
          minLength={8}
          className={`${inputClassName} pr-10`}
          {...props}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     text-gray-300 hover:text-gray-500 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

function DonorFields({ form, onChange, onBloodGroupSelect }) {
  return (
    <>
      <TextField
        label="City / District"
        name="address"
        value={form.address}
        onChange={onChange}
        placeholder="Kathmandu, Bagmati"
      />
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Blood Group <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUPS.map((bloodGroup) => (
            <button
              key={bloodGroup}
              type="button"
              onClick={() => onBloodGroupSelect(bloodGroup)}
              aria-pressed={form.blood_group === bloodGroup}
              className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all
                          ${
                            form.blood_group === bloodGroup
                              ? "bg-red-700 border-red-700 text-white"
                              : "bg-white border-gray-200 text-gray-700 hover:border-red-400"
                          } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600`}
            >
              {bloodGroup}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function HospitalFields({ form, onChange }) {
  return (
    <>
      <TextField
        label="Address"
        name="address"
        value={form.address}
        onChange={onChange}
        placeholder="Mahaboudha, Kathmandu"
      />
      <TextField
        label={
          <>
            License / Registration No. <span className="text-red-600">*</span>
          </>
        }
        name="license_no"
        value={form.license_no}
        onChange={onChange}
        placeholder="NMC-2024-XXXXX"
        required
      />
      <div
        className="flex items-start gap-2.5 bg-amber-50 border
                   border-amber-200 rounded-xl p-3.5"
      >
        <AlertCircle size={15} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          Hospital accounts need admin approval before you can post requests.
          Expect a decision within 24 hours.
        </p>
      </div>
    </>
  );
}

export default function AuthForm({
  view,
  pathRole,
  selectedRole,
  onRoleSelect,
  form,
  onChange,
  onBloodGroupSelect,
  showPassword,
  onTogglePassword,
  error,
  loading,
  onSubmit,
}) {
  const isRegister = view === "register";

  return (
    <>
      {isRegister && !pathRole && (
        <RoleSelector selectedRole={selectedRole} onSelect={onRoleSelect} />
      )}

      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-600
                     text-red-800 text-sm px-4 py-3 rounded-lg mb-5"
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {isRegister && (
          <>
            <TextField
              label={
                selectedRole === "hospital" ? "Hospital Name" : "Full Name"
              }
              name={selectedRole === "hospital" ? "hospital_name" : "full_name"}
              value={
                selectedRole === "hospital"
                  ? form.hospital_name
                  : form.full_name
              }
              onChange={onChange}
              placeholder={
                selectedRole === "hospital" ? "Bir Hospital" : "Ram Shrestha"
              }
              required
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="+977-98XXXXXXXX"
            />
          </>
        )}

        <TextField
          type={isRegister ? "email" : "text"}
          label={isRegister ? "Email" : "Email or username"}
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@example.com or admin username"
          required
        />

        {isRegister && selectedRole === "donor" && (
          <DonorFields
            form={form}
            onChange={onChange}
            onBloodGroupSelect={onBloodGroupSelect}
          />
        )}

        {isRegister && selectedRole === "hospital" && (
          <HospitalFields form={form} onChange={onChange} />
        )}

        <PasswordField
          value={form.password}
          onChange={onChange}
          showPassword={showPassword}
          onToggle={onTogglePassword}
          required
        />

        {isRegister && (
          <TextField
            type="password"
            label="Confirm Password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={onChange}
            placeholder="........"
            required
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl
                     hover:bg-red-700 transition-all shadow-lg shadow-red-100
                     disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="30 70"
                />
              </svg>
              One moment...
            </>
          ) : view === "login" ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </>
  );
}
