import { useEffect, useState } from "react";
import { fetchData } from "../api/api";
import { useAuth } from "../hooks/useAuth";

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  venue?: { id: string };
}

interface CustomCalendarProps {
  venueId: string;
  onDateSelect: (checkIn: Date | null, checkOut: Date | null) => void;
  selectedDates: { checkIn: Date | null; checkOut: Date | null };
}

const CustomCalendar = ({
  venueId,
  onDateSelect,
  selectedDates,
}: CustomCalendarProps) => {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const { token, apiKey } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token || !apiKey) {
        console.warn("⚠️ Missing token or API key. Cannot fetch venue.");
        return;
      }

      try {
        const response = await fetchData(`/venues/${venueId}?_bookings=true`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response || !response.data) {
          console.warn("⚠️ No venue found or venue has no bookings.");
          return;
        }

        const venue = response.data;
        const venueBookings = venue.bookings || [];

        const bookedDates = venueBookings.flatMap((booking: Booking) => {
          if (!booking.dateFrom || !booking.dateTo) {
            console.warn("⚠️ Skipping booking due to missing dates:", booking);
            return [];
          }

          const startDate = new Date(booking.dateFrom);
          const endDate = new Date(booking.dateTo);

          const dates: Date[] = [];
          for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
          ) {
            dates.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
          }

          return dates;
        });

        setUnavailableDates(bookedDates);
      } catch (err) {
        console.error("❌ Fetch failed:", err);
      }
    };

    if (venueId) fetchBookings();
  }, [venueId, token, apiKey]);

  const prevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const lastDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    const daysArray = [];

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      daysArray.push(new Date(d));
    }

    return daysArray;
  };

  const isSelectedRange = (date: Date) => {
    return (
      selectedDates.checkIn &&
      selectedDates.checkOut &&
      date >= selectedDates.checkIn &&
      date <= selectedDates.checkOut
    );
  };

  const handleDateClick = (date: Date) => {
    if (
      unavailableDates.some(
        (bookedDate) => bookedDate.toDateString() === date.toDateString()
      )
    )
      return;

    if (
      !selectedDates.checkIn ||
      (selectedDates.checkIn && selectedDates.checkOut)
    ) {
      onDateSelect(date, null);
    } else if (date > selectedDates.checkIn) {
      onDateSelect(selectedDates.checkIn, date);
    } else {
      onDateSelect(date, null);
    }
  };

  return (
    <div className="mt-4 custom-calendar">
      <h5>Venue Availability</h5>
      <div className="calendar-header">
        <button onClick={prevMonth}>❮</button>
        <span>
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button onClick={nextMonth}>❯</button>
      </div>
      <div className="calendar-grid">
        {generateCalendarDays().map((date, index) => {
          const isBooked = unavailableDates.some(
            (bookedDate) => bookedDate.toDateString() === date.toDateString()
          );
          const isSelected = isSelectedRange(date);
          const isCheckIn =
            selectedDates.checkIn?.toDateString() === date.toDateString();
          const isCheckOut =
            selectedDates.checkOut?.toDateString() === date.toDateString();

          return (
            <div
              key={index}
              className={`calendar-day ${isBooked ? "booked" : ""} ${
                isSelected ? "selected" : "available"
              } ${isCheckIn ? "check-in" : ""} ${
                isCheckOut ? "check-out" : ""
              }`}
              onClick={() => handleDateClick(date)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
