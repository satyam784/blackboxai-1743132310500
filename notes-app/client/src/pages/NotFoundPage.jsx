import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
        Page not found
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;