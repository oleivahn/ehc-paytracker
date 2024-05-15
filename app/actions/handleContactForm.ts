"use server";

export const handleContactForm = async (formData: any) => {
  const name = formData.get("name");
  const email = formData.get("email");

  console.log("name", name);
  console.log("email", email);
};
