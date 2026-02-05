"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import buildingsData from "../namebuilding/app/content/data.json";

type Building = { name: string; fileName: string };

const buildings = buildingsData as Building[];

function getImageSrc(fileName: string): string {
  const base = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
  return `/images/${base}`;
}

function randomIndex(): number {
  return Math.floor(Math.random() * buildings.length);
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    setIndex(randomIndex());
  }, []);

  const current = buildings[index];

  const goNext = () => {
    setShowName(false);
    setIndex(randomIndex());
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              src={getImageSrc(current.fileName)}
              alt={current.name}
              width={400}
              height={300}
              className={styles.buildingImage}
              unoptimized
            />
          </div>
          {showName && <p className={styles.buildingName}>{current.name}</p>}
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.btnShowName}
              onClick={() => setShowName(!showName)}
            >
              {showName ? "Masquer le nom" : "Afficher le nom"}
            </button>
            <button
              type="button"
              className={styles.btnNext}
              onClick={goNext}
            >
              Image suivante
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
