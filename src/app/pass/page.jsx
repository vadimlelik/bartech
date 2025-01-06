'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';

import styles from './passPage.module.css';
import Image from 'next/image';

const Pass = () => {
  const images = [
    '/pass_img.png',
    '/pass_slide2_img.png',
    '/pass_slide3_img.png',
    '/pass_slide4_img.png',
    '/pass2_img.png',
  ];

  return (
    <div className={styles.container}>
      <h1>Условия рассрочки Перечень данных</h1>
      <p>Перечень данных</p>
      <div className="slider">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className={styles.sliderSwiper}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <Image
                className={styles.image}
                src={src}
                alt={`Slide ${index + 1}`}
                width={400}
                height={300}
                layout="responsive"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Pass;
