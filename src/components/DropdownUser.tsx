import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import securityService from "../services/securityService";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);

  const trigger = useRef<HTMLAnchorElement | null>(null);
  const dropdown = useRef<HTMLDivElement | null>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [topEndpoint, setTopEndpoint] = useState<{ [key: string]: number } | null>(null);

  // ---------- LISTENERS: click fuera y escape ----------
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!dropdownOpen) return;
      if (!dropdown.current || !trigger.current) return;

      if (
        dropdown.current.contains(e.target as Node) ||
        trigger.current.contains(e.target as Node)
      ) return;

      setDropdownOpen(false);
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dropdownOpen]);

  // ---------- GUARDAR INPUT EN LOCALSTORAGE ----------
  useEffect(() => {
    const wordsArray = inputValue
      .split(",")
      .map((w) => w.trim())
      .filter((w) => w !== "");

    localStorage.setItem("userKeywords", JSON.stringify(wordsArray));
  }, [inputValue]);

  // ---------- CALCULAR ENDPOINT MÁS CONSULTADO ----------
  const updateTopEndpoint = () => {
    const scoresRaw = localStorage.getItem("scores");
    if (!scoresRaw) return setTopEndpoint(null);

    const scores = JSON.parse(scoresRaw) as Record<string, number>;
    if (Object.keys(scores).length === 0) return setTopEndpoint(null);

    const topKey = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    setTopEndpoint({ [topKey]: scores[topKey] });
  };

  useEffect(() => {
    updateTopEndpoint();
    window.addEventListener("storage", updateTopEndpoint);
    return () => window.removeEventListener("storage", updateTopEndpoint);
  }, []);

  const avatarUrl =
    user?.avatar_url ||
    JSON.parse(localStorage.getItem("user") || "{}")?.avatar_url ||
    "";

  return (
    <div className="relative flex items-center gap-4">
      {/* USER INFO */}
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium">
            {user?.name ?? "Guest"}
          </span>
          <span className="block text-xs">UX Designer</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={avatarUrl} alt="User" className="rounded-full" />
        </span>
      </Link>

      {/* ENDPOINT MÁS CONSULTADO */}
      <div className="ml-4 text-sm">
        {topEndpoint ? (
          <p>
            <strong>El endpoint más consultado fue:</strong>{" "}
            <span className="font-semibold text-blue-600">
              {Object.keys(topEndpoint)[0]} ({Object.values(topEndpoint)[0]} veces)
            </span>
          </p>
        ) : (
          <p className="italic text-gray-500">Sin registros aún</p>
        )}
      </div>

      {/* DROPDOWN */}
      {dropdownOpen && (
        <div
          ref={dropdown}
          className="absolute right-0 top-16 w-62.5 rounded-sm border bg-white shadow"
        >
          {/* Opciones */}
          <ul className="flex flex-col gap-5 border-b px-6 py-7.5">
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/settings">Account Settings</Link></li>
            <li>
              <button onClick={() => securityService.logout()}>
                Logout
              </button>
            </li>
          </ul>

          {/* Input */}
          <div className="px-6 py-4 border-t">
            <label className="block text-sm mb-1">
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
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
