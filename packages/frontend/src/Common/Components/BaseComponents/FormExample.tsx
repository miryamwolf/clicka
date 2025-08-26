// src/EjemploForm.tsx (o donde lo tengas)
import React from "react";
import { z } from "zod";
import { Form } from "./Form";
import { InputField } from "./Input";
import { CheckboxField } from "./CheckBox";
import { Button } from "./Button";

const schema = z.object({
  email: z.string().min(1, "Email required").email("Invalid Email").nonempty("EMAIL"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Yo need to accept the terms",
  }),
});

export const FormExample = () => {
  const handleSubmit = (data: z.infer<typeof schema>) => {
    alert("The form has been sent successfully:\n" + JSON.stringify(data, null, 2));
  };

  return (
    <Form
      label="Example Form"
      schema={schema}
      onSubmit={handleSubmit}
      className="mx-auto mt-10"
    >
      <InputField name="email" label="Email" required />
      <CheckboxField name="acceptTerms" label="Accept the terms" required />
      <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Send
      </Button>
    </Form>
  );
};
