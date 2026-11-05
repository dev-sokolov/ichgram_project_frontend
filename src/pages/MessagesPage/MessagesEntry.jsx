import { useSelector } from "react-redux";

import { selectIsGuest } from "../../redux/auth/auth-selectors";
import MessagesPage from "./MessagesPage";
import GuestMessagesPage from "../GuestMessagesPage/GuestMessagesPage";

const MessagesEntry = () => {
    const isGuest = useSelector(selectIsGuest);
    return isGuest ? <GuestMessagesPage /> : <MessagesPage />;
};

export default MessagesEntry;
