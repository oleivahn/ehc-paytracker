# Server Actions Notes

- The main component HAS to be a server component.
  - The server action is also inside of this server component. So a server component inside of another server component.

```jsx
export default async function ContactUs() {
  const formAction = async (formData: FormData) => {
    "use server";

    const name = formData.get("name");
    const email = formData.get("email");

    // TODO: Do something with the form data

    // Can also outsource it to a diff file but make sure you mark it as a use server directive
    const results = await contactFormAction(formData);
    console.log("📗 LOG [ results ]:", results);
  };

  return <form action={formAction}>...</form>;
}
```

- External file

```jsx
"use server";

export const contactFormAction = async (formData: any) => {
  const name = formData.get("name");
  const email = formData.get("email");

  return { name, email };
};
```
