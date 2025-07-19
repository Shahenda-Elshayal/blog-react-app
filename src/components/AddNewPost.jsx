// import React, { useContext } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { collection, addDoc, Timestamp } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { db } from "../firebase/firebaseConfig";

// export default function AddNewPost() {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const [loading, setLoading] = useState(false);
//   const IMGBB_API_KEY = "250c0342e03098eca6a8aa8ee9aa5392";

//   const formik = useFormik({
//     initialValues: {
//       title: "",
//       description: "",
//       image: null,
//     },
//     validationSchema: Yup.object({
//       title: Yup.string().required("Title is required"),
//       description: Yup.string().required("Description is required"),
//       image: Yup.mixed().nullable(),
//     }),
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         if (!user) {
//           alert("You must be logged in to post.");
//           return;
//         }
//         let postImageUrl = null;

//         if (values.image) {
//           const formData = new FormData();
//           formData.append("image", values.image); // نضيف ملف الصورة للـ FormData

//           const response = await fetch(
//             `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
//             {
//               method: "POST",
//               body: formData,
//             }
//           );

//           const data = await response.json();

//           if (data.success) {
//             postImageUrl = data.data.url; // ناخد رابط الصورة اللي رجع من ImgBB
//           } else {
//             console.error("خطأ في رفع الصورة إلى ImgBB:", data.error.message);
//             setLoading(false);
//             return;
//           }
//         }
//         await addDoc(collection(db, "posts"), {
//           title: values.title,
//           description: values.description,
//           createdAt: Timestamp.now(),
//           userId: user.uid,
//           username: user.displayName,
//           photoURL: user.photoURL || null,
//           postImageUrl: postImageUrl,
//         });

//         navigate("/");
//       } catch (error) {
//         console.error("Error adding post:", error);
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   // handle file change
//   const handleImageChange = (e) => {
//     const file = e.currentTarget.files[0];
//     formik.setFieldValue("image", file);
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[calc(100vh-70px)] px-4">
//       <div className="max-w-[600px] w-full bg-white p-8 rounded shadow-md">
//         <h2 className="text-3xl font-extrabold text-center text-dark-red mb-6">
//           Add New Post
//         </h2>

//         <form onSubmit={formik.handleSubmit} className="space-y-4">
//           {/* Title */}
//           <div>
//             <label className="block mb-1 font-medium text-dark-red">
//               Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               className="input input-bordered w-full"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.title}
//             />
//             {formik.touched.title && formik.errors.title && (
//               <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block mb-1 font-medium text-dark-red">
//               Description
//             </label>
//             <textarea
//               name="description"
//               className="textarea textarea-bordered w-full"
//               rows="4"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.description}
//             />
//             {formik.touched.description && formik.errors.description && (
//               <p className="text-red-500 text-sm mt-1">
//                 {formik.errors.description}
//               </p>
//             )}
//           </div>

//           {/* Image (optional) */}
//           <div>
//             <label className="block mb-1 font-medium text-dark-red">
//               Image (optional)
//             </label>
//             <input
//               type="file"
//               name="image"
//               accept="image/*"
//               className="file-input file-input-bordered w-full"
//               onChange={handleImageChange}
//               onBlur={formik.handleBlur}
//             />
//           </div>

//           {/* Submit */}

//           <button
//             type="submit"
//             className="btn w-full bg-light-red text-white hover:text-lightest-beige"
//             // disabled={loading || !formik.isValid}
//           >
//             Add Post
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";

export default function AddNewPost() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { postId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const IMGBB_API_KEY = "250c0342e03098eca6a8aa8ee9aa5392";

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      image: null,
      existingImageUrl: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      image: Yup.mixed()
        .nullable()
        .test("fileSize", "File too large (max 5MB)", (value) =>
          value ? value.size <= 5 * 1024 * 1024 : true
        )
        .test("fileType", "Unsupported file format", (value) =>
          value
            ? ["image/jpeg", "image/png", "image/gif"].includes(value.type)
            : true
        ),
    }),
    onSubmit: async (values) => {
      // ✅ FIX: Moved setLoading(true) to the very beginning of the onSubmit function
      setLoading(true); 
      try {
        if (!user) {
          alert("You must be logged in to post.");
          setLoading(false);
          return;
        }

        let postImageUrl = values.existingImageUrl;

        if (values.image) {
          const formData = new FormData();
          formData.append("image", values.image);

          const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          if (data.success) {
            postImageUrl = data.data.url;
          } else {
            console.error(
              "Error uploading image to ImgBB:",
              data.error.message
            );
            alert("Failed to upload image: " + data.error.message);
            setLoading(false);
            return;
          }
        }

        const postData = {
          title: values.title,
          description: values.description,
          userId: user.uid,
          username: user.displayName,
          photoURL: user.photoURL || null,
          postImageUrl: postImageUrl,
        };

        if (postId) {
          // If postId exists, update the existing post
          const postRef = doc(db, "posts", postId);
          await updateDoc(postRef, postData);
          console.log("Post updated successfully!");
        } else {
          // ✅ FIX: Moved this addDoc call INSIDE the else block
          await addDoc(collection(db, "posts"), {
            ...postData,
            likes: [], // Initialize likes array for new posts
            createdAt: Timestamp.now(), // Add createdAt only for new posts
          });
          console.log("Post added successfully!");
        }

        navigate("/");
      } catch (error) {
        console.error("Error saving post:", error);
        alert("Failed to save post: " + error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        try {
          const postRef = doc(db, "posts", postId);
          const postSnap = await getDoc(postRef);

          if (postSnap.exists()) {
            const data = postSnap.data();
            formik.setValues({
              title: data.title || "",
              description: data.description || "",
              image: null,
              existingImageUrl: data.postImageUrl || "",
            });
          } else {
            console.error("No such post found!");
            alert("Post not found for editing.");
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching post for edit:", error);
          alert("Error loading post data.");
          navigate("/");
        }
      }
      setInitialDataLoaded(true);
    };

    fetchPostData();
  }, [postId, navigate]);

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    formik.setFieldValue("image", file);
    if (file) {
      formik.setFieldValue("existingImageUrl", "");
    }
  };

  if (postId && !initialDataLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-70px)] px-4">
        <p className="text-dark-red text-lg">Loading post for editing...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-70px)] px-4">
      <div className="max-w-[600px] w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-dark-red mb-6">
          {postId ? "Edit Post" : "Add New Post"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium text-dark-red">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="input input-bordered w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-dark-red">
              Description
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered w-full"
              rows="4"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Image (optional) */}
          <div>
            <label className="block mb-1 font-medium text-dark-red">
              Image (optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.image && formik.errors.image && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
            )}
            {postId &&
              formik.values.existingImageUrl &&
              !formik.values.image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img
                    src={formik.values.existingImageUrl}
                    alt="Current Post"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select a new image to replace it.
                  </p>
                </div>
              )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn w-full bg-light-red text-white hover:text-lightest-beige"
            disabled={loading || !formik.isValid}
          >
            {loading
              ? postId
                ? "Updating Post..."
                : "Adding Post..."
              : postId
              ? "Update Post"
              : "Add Post"}{" "}
          </button>
        </form>
      </div>
    </div>
  );
}
