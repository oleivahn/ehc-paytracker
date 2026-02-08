import { z } from "zod";

// Info: All these fields must be supplied for proper validation
// Note: user field is computed from name and validated server-side
export const schema = z.object({
  name: z.string().min(2, {
    message: "Name cannot be empty",
  }),
  shiftDate: z.coerce.date({
    errorMap: ({ code }, { defaultError }) => {
      if (code == "invalid_date") return { message: "Date is required" };
      return { message: defaultError };
    },
  }),
  location: z.string().min(2, {
    message: "Location must be filled",
  }),
  shiftType: z.string().min(2, {
    message: "Shift must be filled",
  }),
  easyDate: z.string().optional(),
  outOfState: z.boolean().optional(),
});
