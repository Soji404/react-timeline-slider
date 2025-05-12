import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper/types';
import { timelineData } from '../data/timelineData';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/main.scss';
import { CirclePoints } from './CirclePoints';

export const TimelineSlider = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const sliderPrevRef = useRef<HTMLButtonElement | null>(null);
  const sliderNextRef = useRef<HTMLButtonElement | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const startYearRef = useRef<HTMLSpanElement>(null);
  const endYearRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(timelineData.length - 1);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiperReady, setSwiperReady] = useState(false);
  const activeSlide = timelineData[activeIndex];

  const animateNumbers = (newStart: number, newEnd: number) => {
    if (startYearRef.current && endYearRef.current) {
      gsap.fromTo(startYearRef.current,
        { textContent: startYearRef.current.textContent },
        {
          textContent: newStart,
          duration: 1,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: function () {
            if (startYearRef.current) {
              startYearRef.current.textContent = Math.floor(Number(this.targets()[0].textContent)).toString();
            }
          }
        }
      );

      gsap.fromTo(endYearRef.current,
        { textContent: endYearRef.current.textContent },
        {
          textContent: newEnd,
          duration: 1,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: function () {
            if (endYearRef.current) {
              endYearRef.current.textContent = Math.floor(Number(this.targets()[0].textContent)).toString();
            }
          }
        }
      );
    }
  };

  const handleSwiper = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    setSwiperReady(true);

    setTimeout(() => {
      if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
        swiper.params.navigation.prevEl = sliderPrevRef.current;
        swiper.params.navigation.nextEl = sliderNextRef.current;
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }

      if (swiper.params.pagination && typeof swiper.params.pagination !== 'boolean') {
        swiper.params.pagination.el = paginationRef.current;
        swiper.pagination.destroy();
        swiper.pagination.init();
        swiper.pagination.update();
      }
    });
  };

  useEffect(() => {
    if (swiperReady && swiperRef.current) {
      swiperRef.current.slideTo(0);
      setIsBeginning(true);
      setIsEnd(swiperRef.current.isEnd);

      gsap.from(".swiper-slide", {
        duration: 0.5,
        y: -20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  }, [activeIndex, swiperReady]);

  const handlePeriodPrev = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      animateNumbers(timelineData[newIndex].range[0], timelineData[newIndex].range[1]);
      setActiveIndex(newIndex);
    }
  };

  const handlePeriodNext = () => {
    if (activeIndex < timelineData.length - 1) {
      const newIndex = activeIndex + 1;
      animateNumbers(timelineData[newIndex].range[0], timelineData[newIndex].range[1]);
      setActiveIndex(newIndex);
    }
  };

  const handleCirclePointClick = (index: number) => {
    animateNumbers(timelineData[index].range[0], timelineData[index].range[1]);
    setActiveIndex(index);
  };

  return (
    <div className="timeline-container">
      <div className="top">
        <div className="title">
          <div className="gradient"></div>
          <h2>Исторические <span>даты</span></h2>
        </div>

        <div className="range">
          <div className="items">
            <span ref={startYearRef}>{activeSlide.range[0]}</span>
            <span ref={endYearRef}>{activeSlide.range[1]}</span>
          </div>
        </div>

        <div className="arrows arrows_desktop">
          <span>{String(activeIndex + 1).padStart(2, '0')}/0{timelineData.length}</span>
          <div className="items">
            <button
              onClick={handlePeriodPrev}
              disabled={activeIndex === 0}
              className={activeIndex === 0 ? 'disabled' : ''}
            >
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.49988 0.750001L2.24988 7L8.49988 13.25" stroke={activeIndex === 0 ? "#ccc" : "#42567A"} strokeWidth="2" />
              </svg>
            </button>

            <button
              onClick={handlePeriodNext}
              disabled={activeIndex === timelineData.length - 1}
              className={activeIndex === timelineData.length - 1 ? 'disabled' : ''}
            >
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.50012 0.750001L7.75012 7L1.50012 13.25" stroke={activeIndex === timelineData.length - 1 ? "#ccc" : "#42567A"} strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      <CirclePoints
        activeIndex={activeIndex}
        onChange={handleCirclePointClick}
      />

      <div className="mobile-category">
        {activeSlide.category}
      </div>

      <Swiper
        key={`swiper-${activeIndex}`}
        modules={[Navigation, Pagination]}
        slidesPerView="auto"
        navigation={{
          prevEl: sliderPrevRef.current,
          nextEl: sliderNextRef.current,
        }}
        pagination={{
          el: paginationRef.current,
          clickable: true,
          type: 'bullets',
        }}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40
          }
        }}
        onSwiper={handleSwiper}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {activeSlide.items.map((event) => (
          <SwiperSlide key={event.year} style={{ width: 'auto' }}>
            <div className="slide">
              <h3>{event.year}</h3>
              <p>{event.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="slider-navigation">
        <div className="items">
          <button
            ref={sliderPrevRef}
            style={{ visibility: isBeginning ? 'hidden' : 'visible' }}
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.49988 0.750001L2.24988 7L8.49988 13.25" stroke="#42567A" stroke-width="2" />
            </svg>
          </button>
          <button
            ref={sliderNextRef}
            style={{ visibility: isEnd ? 'hidden' : 'visible' }}
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.50012 0.750001L7.75012 7L1.50012 13.25" stroke="#42567A" stroke-width="2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="arrows-mobile">

        <div className="arrows-mobile__nav">
          <span>{String(activeIndex + 1).padStart(2, '0')}/0{timelineData.length}</span>
          <div className="items">
            <button
              onClick={handlePeriodPrev}
              disabled={activeIndex === 0}
              className={activeIndex === 0 ? 'disabled' : ''}
            >
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.49988 0.750001L2.24988 7L8.49988 13.25" stroke={activeIndex === 0 ? "#ccc" : "#42567A"} strokeWidth="2" />
              </svg>
            </button>

            <button
              onClick={handlePeriodNext}
              disabled={activeIndex === timelineData.length - 1}
              className={activeIndex === timelineData.length - 1 ? 'disabled' : ''}
            >
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.50012 0.750001L7.75012 7L1.50012 13.25" stroke={activeIndex === timelineData.length - 1 ? "#ccc" : "#42567A"} strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        <div className="arrows-mobile__pagination" ref={paginationRef}></div>

      </div>

    </div>
  );
};