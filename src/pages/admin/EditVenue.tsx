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
    media: [{ url: "", alt: "" }],
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
        const response = await fetchData(`/venues/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        });

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
          media: venue.media.length ? venue.media : [{ url: "", alt: "" }],
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
      media: formData.media.filter((m) => m.url.trim()),
    };

    try {
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
    <div className="container mt-5 venue-form-container">
      <h1 className="text-center">Edit Venue</h1>
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
          className="btn w-100 custom-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Venue"}
        </button>
      </form>
    </div>
  );
};

export default EditVenue;
