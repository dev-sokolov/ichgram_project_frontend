import Container from "../../modules/Container/Container";

import Error from "../../shared/components/Error/Error";

import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../../redux/posts/posts-thunks";
import { getAllPostsSelector } from "../../redux/posts/posts-selectors";
import { useEffect } from "react";

import { Link } from "react-router-dom";

import styles from "./ExplorePage.module.css";

const ExplorePage = () => {
    const dispatch = useDispatch();
    const { allPosts, loading, error } = useSelector(getAllPostsSelector) || {};

    useEffect(() => {
        dispatch(getAllPosts());
    }, [dispatch])

    const shuffledPosts = [...allPosts].sort(() => Math.random() - 0.5).slice(0, 10);;

    const elements = shuffledPosts.map((post, index) => <Link to={`/post-other/${post._id}`} key={post._id} className={index === 2 || index === 5 ? styles.tall : ""}>
        <img src={post.image} alt="post" />
    </Link>);

    return (
        <>
            <Container>
                <div className={styles.wrap}>
                    <div className={styles.gallery}>
                        {elements}
                    </div>
                    {loading && "Loading..."}
                    {error && <Error>{error}</Error>}
                </div>
            </Container>
        </>
    )
}

export default ExplorePage;