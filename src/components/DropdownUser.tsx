import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import UserOne from "../images/user/user-01.png";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // ✅ Estado para el texto de palabras separadas por comas
  const [inputValue, setInputValue] = useState<string>("");

  // ✅ Estado para el endpoint más consultado
  const [topEndpoint, setTopEndpoint] = useState<{ [key: string]: number } | null>(null);

  // Detectar clics fuera del dropdown
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Detectar escape key
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // ✅ Guardar palabras separadas por comas en localStorage
  useEffect(() => {
    if (inputValue.trim() !== "") {
      const wordsArray = inputValue
        .split(",")
        .map((word) => word.trim())
        .filter((word) => word !== "");

      localStorage.setItem("userKeywords", JSON.stringify(wordsArray));
      console.log("✅ Guardado en localStorage:", wordsArray);
    }
  }, [inputValue]);

  // ✅ Calcular endpoint más consultado al abrir el dropdown
  useEffect(() => {
    if (dropdownOpen) {
      const scoresRaw = localStorage.getItem("scores");
      if (scoresRaw) {
        const scores = JSON.parse(scoresRaw) as Record<string, number>;
        if (Object.keys(scores).length > 0) {
          // Buscar la palabra con el valor más alto
          const topKey = Object.keys(scores).reduce((a, b) =>
            scores[a] > scores[b] ? a : b
          );
          setTopEndpoint({ [topKey]: scores[topKey] });
        } else {
          setTopEndpoint(null);
        }
      } else {
        setTopEndpoint(null);
      }
    }
  }, [dropdownOpen]);

  return (
    <div className="relative">
      {/* Botón que despliega el dropdown */}
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user ? user.name : "Guest"}
          </span>
          <span className="block text-xs">UX Designer</span>
        </span>
        <span className="h-12 w-12 rounded-full">
          <img src={UserOne} alt="User" />
        </span>
        <svg
          className={`hidden fill-current sm:block ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* Dropdown */}
      <div
        ref={dropdown}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link to="/profile" className="text-sm font-medium hover:text-primary">
              My Profile
            </Link>
          </li>
          <li>
            <Link to="/settings" className="text-sm font-medium hover:text-primary">
              Account Settings
            </Link>
          </li>
        </ul>

        {/* ✅ Campo para ingresar palabras */}
        <div className="px-6 py-4 border-t border-stroke dark:border-strokedark">
          <label className="block text-sm font-medium mb-1">
            Palabras separadas por comas:
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="users,sessions,roles"
            className="w-full border rounded-md p-2 text-sm"
          />
        </div>

        {/* ✅ Mostrar endpoint más consultado */}
        <div className="px-6 py-4 border-t border-stroke dark:border-strokedark bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>El endpoint más consultado fue:</strong>
          </p>
          {topEndpoint ? (
            <p className="text-sm font-semibold text-blue-600 mt-1">
              {Object.keys(topEndpoint)[0]} ({Object.values(topEndpoint)[0]} veces)
            </p>
          ) : (
            <p className="text-sm italic text-gray-500 mt-1">
              No hay datos registrados aún.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropdownUser;
