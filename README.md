# EchoNest: Your Platform for Shared Voices 🗣️💬

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🌟 About EchoNest

EchoNest is a modern, intuitive, and dynamic platform designed for sharing thoughts, ideas, and stories. Whether you want to quickly jot down a new idea, share an experience, or connect with a community, EchoNest provides a seamless and engaging environment. Built with React and powered by Firebase, it offers robust authentication, real-time data capabilities, and a sleek, responsive user interface.

Dive into a space where your voice finds its echo!

**Live Demo:** [Check out EchoNest Live!](https://blog-react-app-eight.vercel.app/)

---

## ✨ Features

EchoNest comes packed with features to enhance your sharing experience:

* **Robust User Authentication:**
    * **Email & Password:** Secure sign-up and sign-in functionality.
    * **Google Sign-In:** Quick and convenient authentication using your Google account.
    * **Persistent Login:** Users stay logged in across sessions (handled by Firebase).
* **Dynamic Content Creation:**
    * **Add New Posts:** Easily create and publish your thoughts.
    * **Edit Existing Posts:** Modify your posts anytime (future feature / implied by `add-post/:postId` route).
* **Responsive Design:** A beautiful and functional layout that adapts to any screen size (desktop, tablet, mobile) thanks to Tailwind CSS.
* **Intuitive User Interface:** Clean and modern design for an enjoyable user experience.
* **Client-Side Form Validation:** Powered by Formik and Yup for real-time form validation, ensuring data integrity and a smooth user input experience.
* **User Profile Display:** See your display name and profile picture (if available from Google or set manually) in the navigation bar.
* **Error Handling:** Clear error messages for authentication failures.
* **Secure Routing:** Protected routes (e.g., add post) accessible only to authenticated users.

---

## 🚀 Technologies Used

EchoNest is built with a powerful and modern technology stack:

* **Frontend Framework:**
    * [**React.js**](https://react.dev/): A declarative, efficient, and flexible JavaScript library for building user interfaces.
* **Routing:**
    * [**React Router DOM**](https://reactrouter.com/en/main): For declarative routing in your React applications.
* **State Management:**
    * [**React Context API**](https://react.dev/learn/passing-props-with-context): For managing authentication state across the application.
* **Backend & Authentication:**
    * [**Firebase**](https://firebase.google.com/): Google's mobile and web application development platform. Specifically used for:
        * **Firebase Authentication:** Handles user sign-up, sign-in (email/password, Google), and session management.
        * **Firestore (Implied for posts):** A flexible, scalable NoSQL cloud database for storing and syncing data (e.g., user posts).
* **Form Management & Validation:**
    * [**Formik**](https://formik.org/): A small library that helps you with the 3 most annoying parts: getting values in and out of form state, validation and error messages, and handling form submission.
    * [**Yup**](https://github.com/jquense/yup): A JavaScript schema builder for value parsing and validation.
* **Styling:**
    * [**Tailwind CSS**](https://tailwindcss.com/): A utility-first CSS framework for rapidly building custom designs.
    * [**DaisyUI (implied by `input input-bordered`, `btn`)**](https://daisyui.com/): A Tailwind CSS component library that might be used for UI elements.
* **Other:**
    * **ESLint / Prettier:** For code quality and formatting.

---

## 🏁 Getting Started

Follow these steps to get EchoNest up and running on your local machine.

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/en/download/) (LTS recommended)
* [npm](https://www.npmjs.com/get-npm) (comes with Node.js) or [Yarn](https://yarnpkg.com/lang/en/docs/install/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [YOUR_REPO_URL]
    cd EchoNest
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```


### Running the Application

After installation and setting up environment variables, you can run the application:

```bash
npm run dev
# or
yarn dev
