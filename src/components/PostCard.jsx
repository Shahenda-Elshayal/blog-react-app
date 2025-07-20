import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAuthor = user && user.uid === post.userId;

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasLiked = user && post.likes && post.likes.includes(user.uid);
  const likeCount = post.likes ? post.likes.length : 0;

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      const postRef = doc(db, "posts", post.id);
      await deleteDoc(postRef);
      console.log("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post: " + error.message);
    }
  };

  const handleEditClick = () => {
    navigate(`/add-post/${post.id}`);
  };

  const handleLikeToggle = async () => {
    if (!user) {
      alert("You must be logged in to like a post.");
      return;
    }

    const postRef = doc(db, "posts", post.id);
    try {
      if (hasLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
        });
        console.log("Post unliked!");
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
        });
        console.log("Post liked!");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Failed to toggle like: " + error.message);
    }
  };

  return (
    <div className="card bg-white max-w-[800px] w-full shadow-sm">
      {/* User Info */}
      <div className="flex items-center gap-3 px-4 pt-4">
        {post.photoURL ? (
          <img
            src={post.photoURL}
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {/* fallback svg */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-[--color-dark-red]">
            {post.username || "Unknown"}
          </p>
          <p className="text-xs text-gray-500">
            {post.createdAt?.toDate().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post Body */}
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <p>{post.description}</p>

        {post.postImageUrl && (
          <img
            src={post.postImageUrl}
            alt={post.title}
            className="mt-4 rounded-lg object-cover w-full h-auto max-h-80"
          />
        )}

        {/* Like button and count */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleLikeToggle}
            className="btn btn-ghost btn-sm p-0 min-h-0 h-auto text-light-red hover:text-dark-red" // DaisyUI ghost button, no padding, no min-height
            aria-label={hasLiked ? "Unlike post" : "Like post"}
          >
            {/* Filled heart if liked, outlined heart if not */}
            {hasLiked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            )}
          </button>
          <span className="text-sm text-gray-600">{likeCount}</span>{" "}
          {/* Display like count */}
        </div>

        {isAuthor && (
          <div className="card-actions justify-end gap-2 mt-2">
            <button
              onClick={handleEditClick}
              className="btn btn-sm bg-light-red text-lightest-beige hover:bg-dark-red"
            >
              {/* Edit Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                />
              </svg>
            </button>

            <button
              onClick={handleDeleteClick}
              className="btn btn-sm bg-light-red text-lightest-beige hover:bg-dark-red"
            >
              {/* Delete Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
}
