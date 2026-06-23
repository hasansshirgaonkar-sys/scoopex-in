import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isIntersecting) return;

    // Handle video load success
    const handleLoadedData = () => {
      setVideoLoaded(true);
      setVideoError(false);
    };

    // Handle video load error
    const handleError = () => {
      console.warn("Video failed to load, using fallback image");
      setVideoError(true);
      setVideoLoaded(false);
    };

    // Handle video can play through
    const handleCanPlayThrough = () => {
      setVideoLoaded(true);
    };

    // Attempt to play video with error handling
    const playVideo = async () => {
      try {
        // Set video source when intersecting (lazy load)
        if (!video.src && !video.querySelector("source")?.src) {
          const source = document.createElement("source");
          source.src = "/assets/envato_video_gen_Jan_29_2026_19_46_32.mp4";
          source.type = "video/mp4";
          video.appendChild(source);
          video.load();
        }

        await video.play();
      } catch (error) {
        console.log("Video autoplay prevented or failed:", error);
        // Fallback: video poster will show as static background
        setVideoError(true);
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("error", handleError);

    // Small delay to ensure proper loading
    const timeoutId = setTimeout(() => {
      playVideo();
    }, 100);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("error", handleError);
      clearTimeout(timeoutId);
    };
  }, [isIntersecting]);

  const scrollToQuote = () => {
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px]">
      {/* Background Video with Lazy Loading */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoLoaded && !videoError ? "opacity-100" : "opacity-0"
        }`}
        poster="/assets/generated/moving-truck-hero.dim_800x600.jpg"
        aria-label="Background video showing moving services"
      >
        {/* Source will be added dynamically for lazy loading */}
      </video>

      {/* Fallback Image - Shows when video fails or is loading */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ${
          !videoLoaded || videoError ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage:
            "url(/assets/generated/moving-truck-hero.dim_800x600.jpg)",
        }}
        aria-hidden="true"
      />

      {/* Dark Gradient Overlay for Enhanced Contrast and Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/65 to-black/75" />

      {/* SCOOPEX Brand Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-accent/25" />

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

      <div className="container relative z-10 py-20 md:py-28 px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white border border-primary/30 shadow-lg">
              <CheckCircle className="h-4 w-4" />
              Trusted Moving Services
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-tight text-white drop-shadow-2xl">
                Move with
                <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
                  Confidence
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-100 max-w-xl leading-relaxed drop-shadow-lg">
                Connect with professional packers and movers. Get instant
                quotes, compare services, and book your move with ease. Your
                belongings are in safe hands.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={scrollToQuote}
                className="gap-2 text-base px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105"
              >
                Get Instant Quote
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 rounded-full border-2 font-semibold bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 pt-6">
              <div className="space-y-1">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
                  500+
                </div>
                <div className="text-sm text-gray-200 font-medium">
                  Happy Customers
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
                  50+
                </div>
                <div className="text-sm text-gray-200 font-medium">
                  Service Providers
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
                  98%
                </div>
                <div className="text-sm text-gray-200 font-medium">
                  Satisfaction Rate
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[550px] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/30 rounded-3xl blur-3xl" />
            <div className="relative">
              <img
                src="/assets/generated/moving-truck-hero.dim_800x600.jpg"
                alt="Moving truck"
                className="rounded-3xl shadow-2xl object-cover w-full h-full border-4 border-white/20"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
