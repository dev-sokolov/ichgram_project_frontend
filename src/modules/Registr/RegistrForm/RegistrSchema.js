import * as Yup from "yup";

import { emailSchema, fullNameSchema, usernameSchema, passwordSchema } from "../../../shared/utils/validation";

const registrSchema = Yup.object({
    email: emailSchema,
    fullName: fullNameSchema,
    username: usernameSchema,
    password: passwordSchema,
});

export default registrSchema;