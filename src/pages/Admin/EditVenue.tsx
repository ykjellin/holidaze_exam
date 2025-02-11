import { useParams } from "react-router-dom";

const EditVenue = () => {
  const { id } = useParams();

  return (
    <div className="container mt-5">
      <h1 className="text-center">Edit Venue</h1>
      <form className="mx-auto" style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label htmlFor="venueName" className="form-label">
            Venue Name
          </label>
          <input
            type="text"
            className="form-control"
            id="venueName"
            defaultValue={`Venue ${id}`}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="venueLocation" className="form-label">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            id="venueLocation"
            defaultValue="Sample Location"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="venueDescription" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="venueDescription"
            rows={3}
            defaultValue="Sample Description"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Update Venue
        </button>
      </form>
    </div>
  );
};

export default EditVenue;
