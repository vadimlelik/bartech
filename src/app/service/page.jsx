'use client';

import styles from './servicePage.module.css';

const Service = () => {
  return (
    <div className={styles.serviceCenters}>
      <h1 className={styles.title}>Сервисные центры</h1>

      <div className={styles.list}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>БелСмартОранж (Mixtech)</h2>
          <p className={styles.cardText}>пн-пт 09:00–18:00</p>
          <p className={styles.cardText}>г. Минск, ул. Скрыганова, 4Д</p>
          <div className={`${styles.cardText} ${styles.phones}`}>
            <a className={styles.phoneLink} href="tel:+375445478652">
              +375 44 547-86-52
            </a>
            <a className={styles.phoneLink} href="tel:+375445544206">
              +375 44 554-42-06
            </a>
            <a className={styles.phoneLink} href="tel:+375173360552">
              +375 17 336-05-52
            </a>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>МастерPIN</h2>
          <p className={styles.cardText}>пн-пт 09:00–18:00</p>
          <p className={styles.cardText}>г. Минск, ул. Якуба Коласа, 1</p>
          <div className={`${styles.cardText} ${styles.phones}`}>
            <a className={styles.phoneLink} href="tel:+375293340909">
              +375 29 334 09 09
            </a>
            <a className={styles.phoneLink} href="tel:+375333000909">
              +375 33 300 09 09
            </a>
            <a className={styles.phoneLink} href="tel:+375259000909">
              +375 25 900 09 09
            </a>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Головной сервисный центр</h2>
          <p className={styles.cardText}>
            г. Минск, ул. Кальварийская, 16, п. 221 (ЖК «Парус»)
          </p>
          <p className={styles.cardText}>ст. м. «Фрунзенская»</p>
          <p className={styles.cardText}>пн-пт 09:00–19:00</p>
          <div className={`${styles.cardText} ${styles.phones}`}>
            <a className={styles.phoneLink} href="tel:+375293886622">
              +375 29 388 66 22
            </a>
            <a className={styles.phoneLink} href="tel:+375333886622">
              +375 33 388 66 22
            </a>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>СЦ ноутбуков «Микродом Сервис»</h2>
          <p className={styles.cardText}>пн-пт 09:00–18:00</p>
          <p className={styles.cardText}>г. Минск, ул. Первомайская, 24/2</p>
          <div className={`${styles.cardText} ${styles.phones}`}>
            <a className={styles.phoneLink} href="tel:+375173352755">
              +375 17 335 27 55
            </a>
            <a className={styles.phoneLink} href="tel:+375295760404">
              +375 29 576 04 04
            </a>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>СЦ «MobiLAB»</h2>
          <p className={styles.cardText}>г. Минск, пр. Независимости, 46 Б</p>
          <p className={styles.cardText}>пн-пт 10:00–19:00</p>
          <div className={`${styles.cardText} ${styles.phones}`}>
            <a className={styles.phoneLink} href="tel:+375447751751">
              +375 44 775 17 51
            </a>
            <a className={styles.phoneLink} href="tel:+375333333323">
              +375 33 333 23 23
            </a>
            <a className={styles.phoneLink} href="tel:+375291366669">
              +375 29 136 66 69
            </a>
            <a className={styles.phoneLink} href="tel:+375292722221">
              +375 29 272 22 21
            </a>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>СЦ «Shtenli»</h2>
          <p className={styles.cardText}>
            (ремонт мотоблоков и электровелосипедов)
          </p>
          <p className={styles.cardText}>г. Минск, ул. Медвежино, 10</p>
          <p className={styles.cardText}>пн-пт 09:00–18:00</p>
          <div className={`${styles.cardText} ${styles.phones}`}>
            <a className={styles.phoneLink} href="tel:+375296855600">
              +375 29 685 56 00
            </a>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>СЦ «ATEK»</h2>
          <p className={styles.cardText}>г. Минск, Логойский тракт, 20/5</p>
          <p className={styles.cardText}>пн-пт 09:00–18:00</p>
          <div className={`${styles.cardText} ${styles.phones}`}>
            <a className={styles.phoneLink} href="tel:+375296444618">
              +375 29 644 46 18
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Service;
