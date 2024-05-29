import { z } from "zod";

// Info: All these fields mustd be supplied for proper validation
export const schema = z.object({
  // employeeId: z.string().min(2, {
  //   message: "Employee ID must be at least 2 characters.",
  // }),
  name: z.string().min(2, {
    message: "Name cannot be empty",
  }),
  startDate: z.coerce.date({
    errorMap: ({ code }, { defaultError }) => {
      if (code == "invalid_date") return { message: "Date is required" };
      return { message: defaultError };
    },
  }),
  email: z.string().min(2, {
    message: "Location must be filled",
  }),
});
