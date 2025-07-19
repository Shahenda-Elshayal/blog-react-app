import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore"; // Added onSnapshot
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage any errors

  useEffect(() => {
    const postsCollectionRef = collection(db, "posts");
    // Create a query to order posts by creation date in descending order
    const q = query(postsCollectionRef, orderBy("createdAt", "desc"));

    // Set up a real-time listener using onSnapshot
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Map through the document changes to get post data and their IDs
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id, // Crucial for unique keys and for deletion
          ...doc.data(),
        }));
        setPosts(postsData);
        setLoading(false); // Data loaded, set loading to false
        setError(null); // Clear any previous errors
        console.log("Real-time posts data:", postsData); // For debugging
      },
      (err) => {
        // Handle any errors that occur during real-time listening
        console.error("Error fetching real-time posts:", err);
        setError("Failed to load posts. Please try again later.");
        setLoading(false); // Stop loading on error
      }
    );

    // Cleanup function: This will unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on component mount

  // Display loading message while data is being fetched
  if (loading) {
    return <div className="text-center mt-8 text-lg font-semibold">Loading posts...</div>;
  }

  // Display error message if something went wrong
  if (error) {
    return <div className="text-center mt-8 text-red-500 text-lg font-semibold">{error}</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        {posts.length > 0 ? (
          // Map through the posts and render a PostCard for each
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          // Display a message if there are no posts
          <p className="text-center text-gray-600 text-lg mt-8">No posts yet. Be the first to add one!</p>
        )}
      </div>
    </>
  );
}