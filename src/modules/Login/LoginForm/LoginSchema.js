import * as Yup from "yup";

import { emailSchema, usernameSchema, passwordSchema } from "../../../shared/utils/validation";

const loginSchema = Yup.object({
    email: emailSchema,
    password: passwordSchema,
});

export default loginSchema;