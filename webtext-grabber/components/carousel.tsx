import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

export const Carousel = forwardRef((props, ref) => {
  const [items, setItems] = useState([])
  const [loading] = useState(false)
  const observer = useRef(null)

  useImperativeHandle(ref, () => ({
    addNewTextBlob: (item) => {
      setItems((prevItems) => [...prevItems, item]);
    },
    items: items
  }))

  return (
    <div>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        // lazy={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {items.map((item, index) => (

          <SwiperSlide>
            <a title={item.title} href={item.url} target="_blank">
              <img className="item"
                src={item.screenshotUrl}
                alt={item.title}
                loading="lazy"
              />
            </a>
            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
})