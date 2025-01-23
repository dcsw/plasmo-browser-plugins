import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react'
import { Navigation, Pagination, Scrollbar, A11y, FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/thumbs';

import './carousel.css'

export const Carousel = forwardRef((props, ref) => {
  const [items, setItems] = useState([])
  const [loading] = useState(false)
  const observer = useRef(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useImperativeHandle(ref, () => ({
    addNewTextBlob: (item) => {
      setItems((prevItems) => [...prevItems, item]);
    },
    items: items
  }))

  const childrenThumbs = items.map((item, index) => (
    <SwiperSlide className="item">
      <a title={item.title}>
        <img
          src={item.screenshotUrl}
          alt={item.title}
          loading="lazy"
        />
      </a>
      <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
    </SwiperSlide>
  ))
  const childrenImages = items.map((item, index) => (
    <SwiperSlide className="item">
      <a title={item.title} href={item.url} target="_blank">
        <img
          src={item.screenshotUrl}
          alt={item.title}
          loading="lazy"
        />
      </a>
      <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
    </SwiperSlide>
  ))

  return (
    <div>
      <Swiper
        onSwiper={setThumbsSwiper}
        freeMode={true}
        watchSlidesProgress={true}
        lazy={true}
        pagination={{
          clickable: true,
        }}
        spaceBetween={10}
        slidesPerView={4}
        navigation={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >{childrenThumbs}</Swiper>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        lazy={true}
        pagination={{
          clickable: true,
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiperMainView item"
      >{childrenImages}</Swiper>
    </div>
  )
})