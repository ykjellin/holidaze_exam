const CreateVenue = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Create a New Venue</h1>
      <form className="mx-auto" style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label htmlFor="venueName" className="form-label">
            Venue Name
          </label>
          <input type="text" className="form-control" id="venueName" required />
        </div>
        <div className="mb-3">
          <label htmlFor="venueLocation" className="form-label">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            id="venueLocation"
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
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success w-100">
          Create Venue
        </button>
      </form>
    </div>
  );
};

export default CreateVenue;
