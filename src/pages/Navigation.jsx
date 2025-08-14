import { Route, Routes } from "react-router-dom";

import PublicRoute from "../modules/PublicRoute/PublicRoute";
import PrivateRoute from "../modules/PrivateRoute/PrivateRoute";

import RegistrPage from "./RegistrPage/RegistrPage";
import LoginPage from "./LoginPage/LoginPage";
import ChangeLoginPage from "./ChangeLoginPage/ChangeLoginPage";
import ExplorePage from "./ExplorePage/ExplorePage";
import HomePage from "./HomePage/HomePage";
import MessagesPage from "./MessagesPage/MessagesPage";
import NotificationsPage from "./NotificationsPage/NotificationsPage";

import MyProfilePage from "./MyProfilePage/MyProfilePage";
import OtherProfilePage from "./OtherProfilePage/OtherProfilePage";

import PostOtherPage from "./PostOtherPage/PostOtherPage";
import PostMyPage from "./PostMyPage/PostMyPage";
import EditPostPage from "./EditPostPage/EditPostPage";

import AddPostPage from "./AddPostPage/AddPostPage";
import EditPostPageMenu from "./EditPostPageMenu/EditPostPageMenu";

import EditProfilePage from "./EditProfilePage/EditProfilePage";

import SearchPage from "./SearchPage/SearchPage";
import NotFoundPage from "./NotFoundPage/NotFoundPage";

const Navigation = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/registr" element={<RegistrPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/changeLogin" element={<ChangeLoginPage />} />              
            </Route>
            <Route element={<PrivateRoute />}>
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/message" element={<MessagesPage />} />
                <Route path="/message/:authorId" element={<MessagesPage />} />
                <Route path="/notification" element={<NotificationsPage />} />

                <Route path="/profile-my" element={<MyProfilePage />} />
                <Route path="/profile-other/:authorId" element={<OtherProfilePage />} />

                <Route path="/post-other/:id" element={<PostOtherPage />} />
                <Route path="/post-my/:id" element={<PostMyPage />} />
                <Route path="/post-edit/:id" element={<EditPostPage />} />

                <Route path="/post-add" element={<AddPostPage />} />
                <Route path="/post-edit-menu/:id" element={<EditPostPageMenu />} />

                <Route path="/profile-edit" element={<EditProfilePage />} />

                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}

export default Navigation;



