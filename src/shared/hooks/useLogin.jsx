import { useSelector } from "react-redux";

import { selectAuthUser, selectToken } from "../../redux/auth/auth-selectors";

const useLogin = () => {

    const token = useSelector(selectToken);
    const user = useSelector(selectAuthUser);
    
    return Boolean(token && user);
}

export default useLogin;