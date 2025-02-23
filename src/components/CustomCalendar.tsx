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
}

const CustomCalendar = ({ venueId }: CustomCalendarProps) => {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const { token, apiKey } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token || !apiKey) {
        console.error("❌ Missing authentication credentials.");
        return;
      }

      console.log("📌 Checking venueId in CustomCalendar:", venueId);

      try {
        const response = await fetchData(
          `/bookings?_customer=true&_venue=true`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("📌 API Response:", response);

        if (!response || !Array.isArray(response.data)) {
          console.error(
            "❌ No bookings found or incorrect response structure."
          );
          return;
        }

        // ✅ Ensure bookings include venue
        const validBookings = response.data.filter(
          (booking: Booking) => booking.venue?.id
        );

        // ✅ Filter bookings for this specific venue
        const venueBookings = validBookings.filter(
          (booking: Booking) => booking.venue?.id === venueId
        );

        console.log("✅ Filtered Bookings for Venue:", venueBookings);

        const bookedDates = venueBookings.flatMap((booking: Booking) => {
          if (!booking.dateFrom || !booking.dateTo) return [];

          const startDate = new Date(booking.dateFrom);
          const endDate = new Date(booking.dateTo);
          const dates: Date[] = [];

          for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
          ) {
            dates.push(new Date(d));
          }

          return dates;
        });

        setUnavailableDates(bookedDates);
        console.log("✅ Final Unavailable Dates:", bookedDates);
      } catch (err) {
        console.error("❌ Fetch failed:", err);
      }
    };

    if (venueId) fetchBookings();
  }, [venueId, token, apiKey]);

  // Move to previous month
  const prevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
    );
  };

  // Move to next month
  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );
  };

  // Generate a grid for the current month
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

          return (
            <div
              key={index}
              className={`calendar-day ${isBooked ? "booked" : "available"}`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <style>
        {`
          .custom-calendar {
            border: 1px solid #ddd;
            padding: 10px;
            width: 300px;
            text-align: center;
            font-family: Arial, sans-serif;
          }
          .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
          }
          .calendar-day {
            width: 40px;
            height: 40px;
            line-height: 40px;
            border-radius: 5px;
            text-align: center;
            font-size: 14px;
            position: relative;
          }
          .booked {
            background-color: #ccc;
            color: #fff;
            pointer-events: none;
          }
          .booked::after {
            content: "✖";
            color: red;
            font-size: 24px;
            font-weight: bold;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.8;
          }
          .available {
            background-color: #f0f0f0;
          }
        `}
      </style>
    </div>
  );
};

export default CustomCalendar;
