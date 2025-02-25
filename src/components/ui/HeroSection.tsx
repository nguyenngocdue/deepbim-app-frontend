const HeroSection = () => {
    return (
      <section className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/your-hero-image.jpg')" }}>
        <div className="text-center">
          <h1 className="text-5xl font-bold">Greener, Smarter & Faster</h1>
          <p className="mt-2 text-lg">Modular Construction is the new way of building better.</p>
          <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
            Send Us a Message
          </button>
        </div>
      </section>
    );
  };
  
  export default HeroSection;
  