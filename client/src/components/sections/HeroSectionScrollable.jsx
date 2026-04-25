import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import config from '../../config';
import BookingModal from './BookingModal';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSectionScrollable() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [textColor, setTextColor] = useState('white');
  const [accentColor, setAccentColor] = useState(config.colors.accent);
  const [buttonColors, setButtonColors] = useState({ primary: 'white', secondary: 'black' });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [removedImageIndices, setRemovedImageIndices] = useState([]);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const heroRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imagesWrapperRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/api/content/hero`);
      if (response.data) {
        setHeroData(response.data);
      }
    } catch (err) {
      console.error('Error fetching hero data:', err);
      setHeroData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    setRemovedImageIndices([...removedImageIndices, index]);
    setShowUpdateButton(true);
    setSaveMessage('');
    // Move to next available image
    const availableIndices = images
      .map((_, i) => i)
      .filter(i => !removedImageIndices.includes(i) && i !== index);
    if (availableIndices.length > 0 && currentImageIndex === index) {
      setCurrentImageIndex(availableIndices[0]);
    }
  };

  // Handle undo remove image
  const handleUndoRemove = (index) => {
    setRemovedImageIndices(removedImageIndices.filter(i => i !== index));
    if (removedImageIndices.length === 1) {
      setShowUpdateButton(false);
    }
    setSaveMessage('');
  };

  // Handle saving updated hero images
  const handleSaveUpdates = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');

      // Filter out removed images
      const updatedImages = images.filter((_, index) => !removedImageIndices.includes(index));

      if (updatedImages.length === 0) {
        setSaveMessage('At least one image must remain in the hero section');
        setIsSaving(false);
        return;
      }

      // Save to server using public endpoint
      const response = await axios.post(
        `${config.api.baseUrl}/api/content/hero/update`,
        {
          headline: heroData?.headline || heroContent.headline,
          subheadline: heroData?.subheadline || heroContent.subheadline,
          description: heroData?.description || heroContent.description,
          ctaText: heroData?.ctaText || heroContent.ctaText,
          ctaLink: heroData?.ctaLink || heroContent.ctaLink,
          heroImages: updatedImages,
        }
      );

      if (response.data) {
        setHeroData(response.data);
        setRemovedImageIndices([]);
        setShowUpdateButton(false);
        setSaveMessage('✓ Hero section updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error saving hero updates:', err);
      setSaveMessage(`✗ Error saving updates: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle resetting changes
  const handleResetChanges = () => {
    setRemovedImageIndices([]);
    setShowUpdateButton(false);
    setSaveMessage('');
    setCurrentImageIndex(0);
  };

  // Detect image brightness and set appropriate text color
  const detectImageBrightness = (imgElement) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(imgElement, 0, 0, 200, 200);

      const samples = [
        { x: 0, y: 0 },
        { x: 150, y: 0 },
        { x: 0, y: 150 },
        { x: 150, y: 150 },
        { x: 75, y: 75 }
      ];

      let totalLuminance = 0;
      let sampleCount = 0;

      samples.forEach(sample => {
        try {
          const imageData = ctx.getImageData(sample.x, sample.y, 50, 50);
          const data = imageData.data;

          let r = 0, g = 0, b = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }

          const pixelCount = data.length / 4;
          r = Math.floor(r / pixelCount);
          g = Math.floor(g / pixelCount);
          b = Math.floor(b / pixelCount);

          const [rs, gs, bs] = [r, g, b].map(val => {
            val = val / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
          });
          const luminance = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
          totalLuminance += luminance;
          sampleCount++;
        } catch (e) {
          // Silent error
        }
      });

      const avgLuminance = totalLuminance / sampleCount;

      let color, shadowColor, accent;
      if (avgLuminance > 0.6) {
        color = '#0a0a0a';
        shadowColor = 'rgba(255, 255, 255, 0.8)';
        accent = '#D4AF37';
      } else if (avgLuminance > 0.4) {
        color = '#ffffff';
        shadowColor = 'rgba(0, 0, 0, 0.8)';
        accent = '#FFD700';
      } else {
        color = '#ffffff';
        shadowColor = 'rgba(0, 0, 0, 0.9)';
        accent = '#E6C542';
      }

      setTextColor(color);
      setAccentColor(accent);
      setButtonColors({
        primary: color,
        secondary: color,
        shadowColor: shadowColor
      });
    } catch (err) {
      console.error('Error detecting brightness:', err);
      setTextColor('#ffffff');
      setButtonColors({
        primary: '#ffffff',
        secondary: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.9)'
      });
    }
  };

  const handleImageLoad = (e) => {
    detectImageBrightness(e.target);
  };

  // GSAP Scroll Animation - Only for multiple images
  useGSAP(() => {
    if (!heroRef.current || !textContainerRef.current) return;

    const isMobile = window.innerWidth < 768;
    const images = heroData?.heroImages || [];
    const imageCount = images.length;

    // Only enable GSAP animation if there are 2 or more images
    if (imageCount < 2 || isMobile) {
      return;
    }

    if (!imageContainerRef.current) return;

    const textContainer = textContainerRef.current;
    const imageContainer = imageContainerRef.current;
    const imagesWrapper = imagesWrapperRef.current;
    const heroElement = heroRef.current;

    // Calculate scroll heights - each image gets one viewport height to scroll
    const vh = window.innerHeight;
    const imageScrollHeight = imageCount * vh;
    const totalHeight = vh + imageScrollHeight;

    // Set hero element height only for multiple images
    heroElement.style.height = totalHeight + 'px';

    // Create scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: heroElement,
      start: 'top top',
      end: `+=${imageScrollHeight}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);

        // Calculate which image to show based on scroll progress
        // Each image gets 1/imageCount of the total scroll space
        const imageProgress = Math.min(progress * imageCount, imageCount - 1);
        const newIndex = Math.floor(imageProgress);
        
        if (newIndex !== currentImageIndex) {
          setCurrentImageIndex(newIndex);
        }

        // Phase 1: Text exits and image expands (0 to 0.3 progress)
        // Phase 2: Full screen image carousel (0.3 to 1.0 progress)
        
        let textOpacity = 1;
        let containerWidth = 50;
        
        if (progress < 0.25) {
          // Text visible and exiting, image expanding to fill space
          textOpacity = Math.max(0, 1 - progress * 4);
          containerWidth = 50 + progress * 4 * 50; // Expands from 50% to 100%
        } else {
          // Text fully hidden, image fully expanded
          textOpacity = 0;
          containerWidth = 100;
        }

        // Animate text container - slide up and fade out
        gsap.set(textContainer, {
          opacity: textOpacity,
          y: progress * -100, // Moves up more prominently
          pointerEvents: textOpacity > 0.05 ? 'auto' : 'none'
        });

        // Animate image container - expand to full width
        gsap.set(imageContainer, {
          width: `${containerWidth}%`,
          borderRadius: Math.max(0, 20 - progress * 20) // Removes rounding as it expands
        });

        // Animate image carousel
        // Each image transition takes 1/imageCount of the total scroll
        if (imagesWrapper) {
          const yOffset = imageProgress * 100;
          gsap.set(imagesWrapper, {
            y: -yOffset + '%'
          });
        }
      }
    });

    scrollTriggerRef.current = trigger;

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, { scope: heroRef, dependencies: [heroData, currentImageIndex] });

  // Default hero content
  const heroContent = heroData || {
    headline: 'Elevate Your Beauty',
    subheadline: 'Professional Makeup & Salon Services',
    description: 'Experience sophisticated beauty artistry. Elevate your appearance with expert craftsmanship and premium services tailored to perfection.',
    ctaText: 'Book Appointment',
    ctaLink: '/booking',
    heroImages: [
      'https://images.unsplash.com/photo-1519456591411-323d9b26f669?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1570157394326-eb3b08ea9ce6?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1487412992651-e50da6cdef13?w=600&h=800&fit=crop'
    ]
  };

  // Get all images and filter out removed ones for display
  const allImages = heroContent.heroImages || [];
  const images = allImages.filter((_, index) => !removedImageIndices.includes(index));
  const imageCount = images.length;
  const totalImageCount = allImages.length;

  // Determine widths based on image count
  const textWidth = imageCount === 0 ? 'w-full' : 'w-1/2';
  const shouldShowImages = imageCount > 0;
  const hasMultipleImages = imageCount > 1;

  return (
    <>
      <div
        ref={heroRef}
        className="relative w-full"
        style={{ 
          minHeight: hasMultipleImages ? '300vh' : '100vh'
        }}
      >
        {/* Fixed Container for Animation */}
        <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={images[currentImageIndex] || heroContent.heroImages[0]}
              alt={`Hero ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              style={{
                transition: 'opacity 0.8s ease-in-out',
                opacity: loading ? 0.5 : 1,
              }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Content Container */}
          <div className="absolute inset-0 flex items-center justify-between">
            {/* Left Side - Text Container */}
            <div
              ref={textContainerRef}
              className={`${textWidth} px-8 md:px-12 lg:px-16 flex flex-col justify-center space-y-6`}
              style={{
                opacity: hasMultipleImages ? (scrollProgress < 0.25 ? 1 : 0) : 1,
                willChange: 'transform, opacity',
                zIndex: 10,
                position: 'relative'
              }}
            >
              {/* Top Accent */}
              <div className="flex items-center gap-3">
                <div 
                  className="h-1 transition-all duration-300"
                  style={{ 
                    backgroundColor: accentColor,
                    width: hasMultipleImages ? (scrollProgress < 0.2 ? '48px' : '0px') : '48px'
                  }}
                ></div>
                <span
                  className="font-inter text-xs uppercase tracking-widest transition-opacity duration-300"
                  style={{
                    color: accentColor,
                    textShadow: `1px 1px 2px ${buttonColors.shadowColor}`,
                    opacity: hasMultipleImages ? (scrollProgress < 0.2 ? 1 : 0) : 1
                  }}
                >
                  Welcome to Luxury
                </span>
              </div>

              {/* Main Headline */}
              <h1
                className="font-playfair text-5xl md:text-6xl lg:text-7xl font-light leading-tight max-w-lg transition-opacity duration-300"
                style={{
                  color: textColor,
                  textShadow: `
                    2px 2px 4px ${buttonColors.shadowColor},
                    -2px -2px 4px ${buttonColors.shadowColor}
                  `,
                  opacity: hasMultipleImages ? (scrollProgress < 0.25 ? 1 : 0) : 1
                }}
              >
                {heroContent.headline}
              </h1>

              {/* Subheadline */}
              <p
                className="font-inter text-lg md:text-xl max-w-md transition-opacity duration-300"
                style={{
                  color: textColor,
                  opacity: hasMultipleImages ? (scrollProgress < 0.22 ? 0.95 : 0) : 0.95,
                  textShadow: `1px 1px 3px ${buttonColors.shadowColor}`
                }}
              >
                {heroContent.subheadline}
              </p>

              {/* Description */}
              <p
                className="font-inter text-base leading-relaxed max-w-md transition-opacity duration-300"
                style={{
                  color: textColor,
                  opacity: hasMultipleImages ? (scrollProgress < 0.2 ? 0.9 : 0) : 0.9,
                  textShadow: `1px 1px 2px ${buttonColors.shadowColor}`
                }}
              >
                {heroContent.description}
              </p>

              {/* CTA Buttons */}
              <div 
                className="flex flex-col gap-4 pt-4 transition-opacity duration-300"
                style={{
                  opacity: hasMultipleImages ? (scrollProgress < 0.18 ? 1 : 0) : 1,
                  pointerEvents: hasMultipleImages ? (scrollProgress < 0.18 ? 'auto' : 'none') : 'auto'
                }}
              >
                <button
                  onClick={() => {
                    if (heroContent.ctaLink === '/booking') {
                      setBookingOpen(true);
                    } else if (heroContent.ctaLink?.startsWith('#')) {
                      const elementId = heroContent.ctaLink.substring(1);
                      const element = document.getElementById(elementId);
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-3 font-inter text-sm uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95 rounded-lg shadow-lg w-fit"
                  style={{
                    backgroundColor: config.colors.buttonColor,
                    color: 'white'
                  }}
                >
                  {heroContent.ctaText}
                </button>
                <button
                  onClick={() => {
                    const contactSection = document.getElementById('location');
                    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 font-inter text-sm uppercase tracking-wider font-semibold border-2 rounded-lg transition-all hover:scale-105 active:scale-95 backdrop-blur-sm w-fit"
                  style={{
                    borderColor: textColor,
                    color: textColor,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Right Side - Image Container */}
            {shouldShowImages && (
              <div
                ref={imageContainerRef}
                className="h-full flex items-center justify-center"
                style={{
                  width: '50%',
                  overflow: 'hidden',
                  willChange: hasMultipleImages ? 'width' : 'auto',
                  backgroundColor: '#000'
                }}
              >
                {/* Single Image - Static Display */}
                {imageCount === 1 ? (
                  <div
                    className="rounded-lg overflow-hidden shadow-2xl relative group"
                    style={{
                      width: '300px',
                      height: '400px',
                      aspectRatio: '3 / 4',
                      position: 'relative',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <img
                      src={images[0]}
                      alt="Hero Image"
                      className="w-full h-full object-cover"
                      onLoad={handleImageLoad}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
                    {/* Remove Button - Show on hover */}
                    <button
                      onClick={() => handleRemoveImage(allImages.indexOf(images[0]))}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                      title="Remove image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* Multiple Images - Carousel with GSAP Animation */
                  <div
                    ref={imagesWrapperRef}
                    className="w-full flex flex-col"
                    style={{
                      height: '100%',
                      willChange: 'transform'
                    }}
                  >
                    {allImages.map((image, index) => {
                      const isRemoved = removedImageIndices.includes(index);
                      if (isRemoved) return null; // Skip removed images
                      return (
                        <div
                          key={index}
                          className="w-full h-full flex items-center justify-center flex-shrink-0"
                          style={{
                            minHeight: '100vh'
                          }}
                        >
                          {/* 300x400px container with 3:4 aspect ratio */}
                          <div
                            className="rounded-lg overflow-hidden shadow-2xl relative group"
                            style={{
                              width: '300px',
                              height: '400px',
                              aspectRatio: '3 / 4',
                              position: 'relative',
                              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                              transition: scrollProgress > 0.25 ? 'none' : 'transform 0.3s ease-out'
                            }}
                          >
                            <img
                              src={image}
                              alt={`Hero Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onLoad={index === currentImageIndex ? handleImageLoad : null}
                            />
                            {/* Image overlay for better text contrast */}
                            {index === currentImageIndex && (
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
                            )}
                            {/* Remove Button - Show on hover */}
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                              title="Remove image"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Only visible for multiple images at start */}
      {hasMultipleImages && (
        <div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce pointer-events-none transition-all duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 4),
            display: scrollProgress > 0.4 ? 'none' : 'block'
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className="font-inter text-xs uppercase tracking-wider"
              style={{
                color: textColor,
                textShadow: `1px 1px 2px ${buttonColors.shadowColor}`,
                opacity: Math.max(0, 1 - scrollProgress * 3)
              }}
            >
              Scroll to Explore
            </span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              stroke={textColor}
              viewBox="0 0 24 24"
              style={{
                filter: `drop-shadow(0 0 2px ${buttonColors.shadowColor})`
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Update Button - Shows when images are removed */}
      {showUpdateButton && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 to-transparent pt-8 pb-6 px-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Status Message */}
            {saveMessage && (
              <div
                className={`p-4 rounded-lg text-white text-center font-semibold ${
                  saveMessage.includes('✓')
                    ? 'bg-green-600'
                    : saveMessage.includes('✗')
                    ? 'bg-red-600'
                    : 'bg-blue-600'
                }`}
              >
                {saveMessage}
              </div>
            )}

            {/* Info Message */}
            <div className="bg-blue-900/50 border border-blue-400/50 rounded-lg p-4 text-white text-center text-sm">
              <p>
                {removedImageIndices.length === 1
                  ? `1 image removed`
                  : `${removedImageIndices.length} images removed`}
                . Click "Update" to save changes or "Cancel" to undo.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleSaveUpdates}
                disabled={isSaving}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all shadow-lg flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Hero Section
                  </>
                )}
              </button>
              <button
                onClick={handleResetChanges}
                disabled={isSaving}
                className="px-8 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white font-semibold rounded-lg transition-all shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
