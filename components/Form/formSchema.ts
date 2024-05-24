import { z } from "zod";

export const schema = z.object({
  employeeId: z.string().min(2, {
    message: "Employee ID must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  date: z.string().min(2, {
    message: "Date must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be filled.",
  }),
});
