import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { NavItems } from "./NavItems";
import { UserContext } from "../../context/userContext";
import logo from "../../assets/logo.png";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(UserContext);
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            centsAI
          </span>
        </a>

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 
            rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 
            focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Nav links */}
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul
            className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 
            rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse 
            md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 
            dark:border-gray-700"
          >
            {NavItems.map((item) =>
              !user.id &&
              (item.id === 7 ||
                item.id === 2 ||
                item.id === 3) ? null : user.id &&
                (item.id === 4 || item.id === 5) ? null : (
                <li key={item.id}>
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-sm md:p-0 ${
                        isActive
                          ? "text-blue-700 md:text-blue-700 dark:text-blue-500"
                          : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:text-blue-500"
                      }`
                    }
                    end
                  >
                    {item.title}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
