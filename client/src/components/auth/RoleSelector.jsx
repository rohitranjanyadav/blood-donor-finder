import { roles } from "./authConfig";

const roleImages = {
  donor: "/assets/icons/role-donor.svg",
  patient: "/assets/icons/role-patient.svg",
  hospital: "/assets/icons/role-hospital.svg",
};

export default function RoleSelector({ selectedRole, onSelect }) {
  return (
    <div className="mb-6">
      <label className="block text-xs font-semibold text-gray-600 mb-2">
        Register as
      </label>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            className={`border-2 rounded-xl p-3 text-center transition-all
                        ${
                          selectedRole === role.id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
          >
            <img
              src={roleImages[role.id]}
              alt=""
              aria-hidden="true"
              className="w-7 h-7 mx-auto mb-1.5"
            />
            <div
              className={`text-xs font-bold ${selectedRole === role.id ? "text-red-700" : "text-gray-600"}`}
            >
              {role.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
