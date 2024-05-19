"use server";

// TODO: rename handleContactAction
export const contactFormAction = async (formData: any) => {
  const name = formData.get("name");
  const email = formData.get("email");

  console.log("We are in the server!!");
  console.log("name", name);
  console.log("email", email);
  return { name: name, email: email };
};
