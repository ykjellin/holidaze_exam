const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Welcome to Holidaze</h1>
      <p className="lead">
        Find and book the perfect venue for your next holiday.
      </p>

      <div
        id="venueCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="d-flex justify-content-center">
              <img
                src="https://placehold.co/300x200"
                className="carousel-img prev"
                alt="Venue 1"
              />
              <img
                src="https://placehold.co/600x400"
                className="carousel-img active-img"
                alt="Venue 2"
              />
              <img
                src="https://placehold.co/300x200"
                className="carousel-img next"
                alt="Venue 3"
              />
            </div>
          </div>

          <div className="carousel-item">
            <div className="d-flex justify-content-center">
              <img
                src="https://placehold.co/300x200"
                className="carousel-img prev"
                alt="Venue 4"
              />
              <img
                src="https://placehold.co/600x400"
                className="carousel-img active-img"
                alt="Venue 5"
              />
              <img
                src="https://placehold.co/300x200"
                className="carousel-img next"
                alt="Venue 6"
              />
            </div>
          </div>
        </div>

        <a
          className="carousel-control-prev"
          href="#venueCarousel"
          role="button"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#venueCarousel"
          role="button"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </a>
      </div>
    </div>
  );
};

export default Home;
