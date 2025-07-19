// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";

// export default function Auth() {
//   const [isLogin, setIsLogin] = useState(true); // true = login, false = register

//   // Validation Schema
//   const validationSchema = Yup.object({
//     email: Yup.string().email("Invalid email").required("Required"),
//     password: Yup.string().min(8, "At least 8 characters").required("Required"),
//   });

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       console.log("Form submitted", values);
//       if (isLogin) {
//         console.log("Logging in...");
//       } else {
//         console.log("Registering...");
//       }
//     },
//   });

//   return (
//     <div className="flex justify-center items-center min-h-[calc(100vh-70px)] px-4">
//       <div className="max-w-[600px] w-full bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-3xl font-extrabold text-center text-dark-red mb-6">
//           {isLogin ? "Login to EchoNest" : "Register for EchoNest"}
//         </h2>

//         <form onSubmit={formik.handleSubmit} className="space-y-4">
//           {/* Email */}
//           <div>
//             <label className="block mb-1 font-medium text-dark-red">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               className="input input-bordered w-full"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.email}
//             />
//             {formik.touched.email && formik.errors.email && (
//               <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block mb-1 font-medium text-dark-red">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               className="input input-bordered w-full"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.password}
//             />
//             {formik.touched.password && formik.errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {formik.errors.password}
//               </p>
//             )}
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="btn w-full bg-light-red text-white hover:text-lightest-beige"
//           >
//             {isLogin ? "Login" : "Register"}
//           </button>
//         </form>

//         {/* Toggle between login/register */}
//         <p className="text-center mt-4 text-dark-red">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//           <button
//             className="text-dark-red font-bold hover:underline hover:cursor-pointer"
//             onClick={() => setIsLogin(!isLogin)}
//           >
//             {isLogin ? "Register" : "Login"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig.js";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/"); // تودي المستخدم للصفحة الرئيسية
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError("Google login failed. Try again.");
    }
  };

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    username: isLogin
      ? Yup.string()
      : Yup.string().min(3, "At least 3 characters").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(8, "At least 8 characters").required("Required"),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setError("");

      try {
        if (isLogin) {
          // 🔐 Login
          await signInWithEmailAndPassword(auth, values.email, values.password);
        } else {
          // 🆕 Register
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );

          // 🧑‍💼 Add displayName
          await updateProfile(userCredential.user, {
            displayName: values.username,
          });
        }

        navigate("/");
      } catch (err) {
        console.log("Firebase Error:", err);

        if (err.code === "auth/invalid-credential") {
          setError("Invalid email or password.");
        } else if (err.code === "auth/email-already-in-use") {
          setError("This email is already registered.");
        } else if (err.code === "auth/weak-password") {
          setError("Password is too weak.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-70px)] px-4">
      <div className="max-w-[600px] w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-dark-red mb-6">
          {isLogin ? "Login to EchoNest" : "Register for EchoNest"}
        </h2>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Username (only in register) */}
          {!isLogin && (
            <div>
              <label className="block mb-1 font-medium text-dark-red">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.username}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-dark-red">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="input input-bordered w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-dark-red">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="input input-bordered w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn w-full bg-light-red text-white hover:text-lightest-beige"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <div className="text-center my-4">
            <p className="text-gray-500 mb-2">or</p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 transition"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Continue with Google</span>
            </button>
          </div>
        </form>

        {/* Toggle login/register */}
        <p className="text-center mt-4 text-dark-red">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-dark-red font-bold hover:underline hover:cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
