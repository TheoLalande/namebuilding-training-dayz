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

function shuffledOrder(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export default function Home() {
  const [order, setOrder] = useState<number[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showName, setShowName] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const remaining = shuffledOrder(buildings.length).filter(
      (i) => !knownIds.has(i),
    );
    setOrder(remaining);
    setCurrentPosition(0);
  }, []);

  const currentIndex = order.length > 0 ? order[currentPosition] : 0;
  const current = buildings[currentIndex];
  const allKnown = knownIds.size >= buildings.length;

  const buildDeck = () =>
    shuffledOrder(buildings.length).filter((i) => !knownIds.has(i));

  const goNext = () => {
    setShowName(false);
    if (order.length === 0) return;
    const nextPosition = currentPosition + 1;
    if (nextPosition >= order.length) {
      const nextDeck = buildDeck();
      setOrder(nextDeck);
      setCurrentPosition(0);
    } else {
      setCurrentPosition(nextPosition);
    }
  };

  const markAsKnown = () => {
    setShowName(false);
    const newKnown = new Set(knownIds).add(currentIndex);
    setKnownIds(newKnown);
    const newOrder = order.filter((idx) => idx !== currentIndex);
    if (newOrder.length === 0) {
      const nextDeck = shuffledOrder(buildings.length).filter(
        (i) => !newKnown.has(i),
      );
      setOrder(nextDeck);
      setCurrentPosition(0);
    } else {
      setOrder(newOrder);
      setCurrentPosition((prev) => Math.min(prev, newOrder.length - 1));
    }
  };

  const resetKnown = () => {
    setKnownIds(new Set());
    setOrder(shuffledOrder(buildings.length));
    setCurrentPosition(0);
    setShowName(false);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.appTitle}>Dayz Building Name</h1>
        <div className={styles.mainContent}>
          <div className={styles.card}>
            {!allKnown && (
              <>
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
                {showName && (
                  <p className={styles.buildingName}>{current.name}</p>
                )}
              </>
            )}
            {allKnown ? (
              <div className={styles.allKnownWrap}>
                <p className={styles.allKnown}>You know them all!</p>
                <button
                  type="button"
                  className={styles.btnReset}
                  onClick={resetKnown}
                >
                  Reset
                </button>
              </div>
            ) : (
              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.btnShowName}
                  onClick={() => setShowName(!showName)}
                >
                  {showName ? "Hide Name" : "Show Name"}
                </button>
                <button
                  type="button"
                  className={styles.btnKnow}
                  onClick={markAsKnown}
                >
                  I know this one
                </button>
                <button
                  type="button"
                  className={styles.btnNext}
                  onClick={goNext}
                >
                  Next Image
                </button>
                {knownIds.size > 0 && (
                  <button
                    type="button"
                    className={styles.btnReset}
                    onClick={resetKnown}
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
            {knownIds.size > 0 && (
              <div className={styles.debugKnown}>
                <p className={styles.debugKnownTitle}>
                  Known Buildings ({knownIds.size}/{buildings.length})
                </p>
                <ul className={styles.debugKnownList}>
                  {Array.from(knownIds)
                    .sort((a, b) => a - b)
                    .map((id) => (
                      <li key={id}>{buildings[id].name}</li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
