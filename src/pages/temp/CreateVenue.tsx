import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";

const CreateVenue = () => {
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
    media: [{ url: "", alt: "" }],
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    if (index !== undefined) {
      const updatedMedia = [...formData.media];
      updatedMedia[index] = { ...updatedMedia[index], [name]: newValue };
      setFormData((prev) => ({ ...prev, media: updatedMedia }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const addMediaField = () => {
    if (formData.media.length < 8) {
      setFormData((prev) => ({
        ...prev,
        media: [...prev.media, { url: "", alt: "" }],
      }));
    }
  };

  const removeMediaField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!token || !apiKey) {
      setError("❌ Missing authentication. Please log in.");
      setIsSubmitting(false);
      return;
    }

    const venueData = {
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
      media: formData.media.filter((m) => m.url.trim()),
    };

    try {
      console.log("🔹 Creating venue:", venueData);
      const response = await fetchData("/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify(venueData),
      });

      console.log("✅ Venue Created Successfully:", response);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("❌ Failed to create venue:", err);
      setError("Failed to create venue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 venue-form-container">
      <h1 className="text-center">Create Venue</h1>
      {error && <p className="alert alert-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="mx-auto venue-form">
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
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="wifi"
            checked={formData.wifi}
            onChange={handleChange}
          />
          <label className="form-check-label">WiFi</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="parking"
            checked={formData.parking}
            onChange={handleChange}
          />
          <label className="form-check-label">Parking</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="breakfast"
            checked={formData.breakfast}
            onChange={handleChange}
          />
          <label className="form-check-label">Breakfast</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="pets"
            checked={formData.pets}
            onChange={handleChange}
          />
          <label className="form-check-label">Pets Allowed</label>
        </div>

        <h4 className="mt-3">Media</h4>
        {formData.media.map((media, index) => (
          <div key={index} className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              name="url"
              value={media.url}
              onChange={(e) => handleChange(e, index)}
              placeholder="Enter image URL"
            />
            <label className="form-label mt-2">Alt Text</label>
            <input
              type="text"
              className="form-control"
              name="alt"
              value={media.alt}
              onChange={(e) => handleChange(e, index)}
              placeholder="Enter alt text"
            />
            {index > 0 && (
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={() => removeMediaField(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {formData.media.length < 8 && (
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={addMediaField}
          >
            Add More Images
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Venue"}
        </button>
      </form>
    </div>
  );
};

export default CreateVenue;
