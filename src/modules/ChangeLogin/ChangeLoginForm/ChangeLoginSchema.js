import * as Yup from "yup";

import { emailSchema} from "../../../shared/utils/validation";

const changeLoginSchema = Yup.object({
    email: emailSchema,
});

export default changeLoginSchema;