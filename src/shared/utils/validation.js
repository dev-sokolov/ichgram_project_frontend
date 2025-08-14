import * as Yup from "yup";

export const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "email must contain @, dot and no contain spaces",
  },
};

export const passwordValidation = {
  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]+$/,
  message:
    "Password must contains at least 1 letter, 1 number and 1 special symbol",
};

export const passwordSchema = Yup.string()
  .trim()
  .min(6)
  .matches(passwordValidation.value, passwordValidation.message)
  .required("Password is required");

export const emailSchema = Yup.string()
  .trim()
  .matches(emailValidation.pattern.value, emailValidation.pattern.message)
  .required(emailValidation.required);

export const usernameSchema = Yup.string().trim().min(1).required();
export const fullNameSchema = Yup.string().trim().min(2).required();



