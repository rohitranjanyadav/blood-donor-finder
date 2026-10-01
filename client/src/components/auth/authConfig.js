import { Heart, Hospital, Users } from "lucide-react";

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const roles = [
  { id: "donor", label: "Donor", sub: "I want to donate", icon: Heart },
  { id: "patient", label: "Patient", sub: "I need blood", icon: Users },
  {
    id: "hospital",
    label: "Hospital",
    sub: "Representing a hospital",
    icon: Hospital,
  },
];

export const roleRedirect = {
  donor: "/dashboard",
  patient: "/my-requests",
  hospital: "/my-requests",
  admin: "/admin",
};
