import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchData } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";

const EditVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, apiKey } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    rating: "",
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
    address: "",
    city: "",
    zip: "",
    country: "",
    continent: "",
    lat: "",
    lng: "",
    mediaUrl: "",
    mediaAlt: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenueDetails = async () => {
      if (!token || !apiKey) {
        setError("❌ Missing authentication credentials.");
        return;
      }

      try {
        console.log(`🔹 Fetching Venue: ${id}`);
        const response = await fetchData(`/venues/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        });

        console.log("✅ Venue Data Loaded:", response.data);
        const venue = response.data;

        setFormData({
          name: venue.name || "",
          description: venue.description || "",
          price: venue.price.toString() || "",
          maxGuests: venue.maxGuests.toString() || "",
          rating: venue.rating.toString() || "",
          wifi: venue.meta?.wifi || false,
          parking: venue.meta?.parking || false,
          breakfast: venue.meta?.breakfast || false,
          pets: venue.meta?.pets || false,
          address: venue.location?.address || "",
          city: venue.location?.city || "",
          zip: venue.location?.zip || "",
          country: venue.location?.country || "",
          continent: venue.location?.continent || "",
          lat: venue.location?.lat.toString() || "",
          lng: venue.location?.lng.toString() || "",
          mediaUrl: venue.media?.[0]?.url || "",
          mediaAlt: venue.media?.[0]?.alt || "Venue Image",
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch venue:", err);
        setError("Failed to load venue details.");
        setLoading(false);
      }
    };

    loadVenueDetails();
  }, [id, token, apiKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!token || !apiKey) {
      setError("❌ Missing authentication credentials.");
      setIsSubmitting(false);
      return;
    }

    const updatedVenue = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      rating: Number(formData.rating) || 0,
      meta: {
        wifi: formData.wifi,
        parking: formData.parking,
        breakfast: formData.breakfast,
        pets: formData.pets,
      },
      location: {
        address: formData.address || null,
        city: formData.city || null,
        zip: formData.zip || null,
        country: formData.country || null,
        continent: formData.continent || null,
        lat: formData.lat ? Number(formData.lat) : 0,
        lng: formData.lng ? Number(formData.lng) : 0,
      },
      media: formData.mediaUrl.trim()
        ? [
            {
              url: formData.mediaUrl,
              alt: formData.mediaAlt || "Venue Image",
            },
          ]
        : [],
    };

    try {
      console.log("🔹 Updating venue:", updatedVenue);
      const response = await fetchData(`/venues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify(updatedVenue),
      });

      console.log("✅ Venue Updated Successfully:", response);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("❌ Failed to update venue:", err);
      setError("Failed to update venue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center">Loading venue details...</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center">Edit Venue</h1>
      {error && <p className="alert alert-danger text-center">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="mb-3">
          <label className="form-label">Venue Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Max Guests</label>
            <input
              type="number"
              className="form-control"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h4>Facilities</h4>
        {["wifi", "parking", "breakfast", "pets"].map((facility) => (
          <div key={facility} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name={facility}
              checked={formData[facility as keyof typeof formData] as boolean}
              onChange={handleChange}
            />
            <label className="form-check-label">
              {facility.charAt(0).toUpperCase() + facility.slice(1)}
            </label>
          </div>
        ))}

        <h4 className="mt-3">Media</h4>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            name="mediaUrl"
            value={formData.mediaUrl}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Venue"}
        </button>
      </form>
    </div>
  );
};

export default EditVenue;
