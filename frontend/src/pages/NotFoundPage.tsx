// frontend/src/pages/NotFoundPage.tsx
import React from "react";

function NotFoundPage() {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600">
        The page you are looking for does not exist.
      </p>
      <p className="mt-4">
        <a href="/" className="text-blue-600 hover:underline">
          Go back to Home
        </a>
      </p>
    </div>
  );
}

export default NotFoundPage;
