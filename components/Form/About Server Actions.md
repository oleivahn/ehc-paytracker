# Server Actions Notes

- [Server Actions Main video I used](https://www.youtube.com/watch?v=RadgkoJrhu0&ab_channel=ByteGrad)

This is a 4 file structure that allows you to separate your server actions from your components. This is useful for keeping your components clean and separating concerns.

1. **Shell Component**: This is where you fetch the data and display the updated data once the server action finishes.
2. **Component File** This is the Form AND `THE ONLY CLIENT COMPONENT`
3. **Submit Button** To show the status of the Form
4. **Server Action File**: This is where you define the server action function.

## Shell Component

```jsx
export default function ContactUs() {
  // FETCH DATA AND REVALIDATE HERE

  return <Form />;
}
```

## Component File - Form

```jsx
"use client";
export default async function ContactUs() {
  const ref = React.useRef < HTMLFormElement > null;

  const formAction = async (formData: FormData) => {
    ref.current?.reset();

    const res = await contactFormAction(formData);
    console.log("📗 [ formAction? ]:", res);
  };

  return (
    <form ref={ref} action={formAction}>
      ...
    </form>
  );
}
```

## Server Action

```jsx
"use server";

export const contactFormAction = async (formData: any) => {
  const name = formData.get("name");
  const email = formData.get("email");

  return { name, email };
};
```

## Submit Button

```jsx
import React from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      {pending ? "Sending..." : "Send Email"}
    </button>
  );
};

export default SubmitButton;
```
