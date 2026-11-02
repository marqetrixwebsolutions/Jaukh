"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ArrowUpRight, Check, X } from "lucide-react";

interface ReservationContextValue {
  openReservation: () => void;
}

const ReservationContext = createContext<ReservationContextValue | null>(null);

export function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within ReservationProvider");
  }
  return context;
}

export function ReservationProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" }),
    );
  }, []);

  useEffect(() => {
    if (isOpen && !dialog.current?.open) dialog.current?.showModal();
    else if (!isOpen && dialog.current?.open) dialog.current.close();
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setIsSaved(false);
  };

  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(
      "joukh-reservation",
      JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    );
    setIsSaved(true);
  };

  return (
    <ReservationContext.Provider
      value={{ openReservation: () => setIsOpen(true) }}
    >
      {children}
      <dialog
        ref={dialog}
        className="detail-dialog reservation-dialog"
        aria-labelledby="reservation-title"
        onCancel={close}
        onClose={() => {
          setIsOpen(false);
          setIsSaved(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <button
          className="dialog-close"
          type="button"
          aria-label="Close reservation form"
          onClick={close}
        >
          <X />
        </button>
        <div className="eyebrow">MAKE YOURSELF AT HOME</div>
        <h2 id="reservation-title">Reserve your table.</h2>
        {isSaved ? (
          <div className="request-message" role="status">
            <Check aria-hidden="true" />
            <h3>Your visit is planned.</h3>
            <p>
              Your details are saved on this device. This preview does not send
              a reservation to the restaurant.
            </p>
            <button className="button" type="button" onClick={close}>
              Done <ArrowUpRight size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={submitReservation}>
            <p className="form-note">
              This preview saves your preferred visit details on this device;
              it does not send a booking to the restaurant.
            </p>
            <label>
              Name
              <input
                name="name"
                autoComplete="name"
                placeholder="Name for the table"
                required
              />
            </label>
            <div className="form-row">
              <label>
                Date
                <input name="date" type="date" min={today} required />
              </label>
              <label>
                Number of guests
                <select name="guests" defaultValue="2" required>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((guestCount) => (
                    <option key={guestCount} value={guestCount}>
                      {guestCount} {guestCount === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Time
              <select name="time" defaultValue="19:00" required>
                {[
                  ["12:00", "12:00 PM"],
                  ["13:00", "1:00 PM"],
                  ["14:00", "2:00 PM"],
                  ["15:00", "3:00 PM"],
                  ["16:00", "4:00 PM"],
                  ["17:00", "5:00 PM"],
                  ["18:00", "6:00 PM"],
                  ["19:00", "7:00 PM"],
                  ["20:00", "8:00 PM"],
                  ["21:00", "9:00 PM"],
                  ["22:00", "10:00 PM"],
                  ["23:00", "11:00 PM"],
                  ["00:00", "12:00 AM"],
                  ["01:00", "1:00 AM"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button className="button" type="submit">
              Save my visit <ArrowUpRight size={16} />
            </button>
          </form>
        )}
      </dialog>
    </ReservationContext.Provider>
  );
}
