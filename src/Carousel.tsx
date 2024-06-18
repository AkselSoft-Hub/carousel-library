import React, { useState, useRef, useEffect, ReactNode } from "react";
import styled from "styled-components";

interface CarouselProps {
  children: React.ReactNode[];
  isInfinite?: boolean;
  interval?: number;
  error?: string;
}

const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const CarouselTrack = styled.div<{ translateX: number; deltaX: number }>`
  display: flex;
  transform: ${({ translateX, deltaX }) =>
    `translateX(${translateX + deltaX}px)`};
  transition: ${({ deltaX }) => `transform ${deltaX ? "0" : "0.3"}s ease-out`};
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  justify-content: center;
  align-items: center;
  color: red;
  border: 1px solid red;
`;

const Carousel: React.FC<CarouselProps> = ({
  children,
  isInfinite = false,
  interval = 3000,
  error = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [scrollInterval, setScrollInterval] = useState(interval);
  const [touchStartPoint, setTouchStartPoint] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [errors, setErrors] = useState(error);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<false>;

  const handleNext = () => {
    if (!isInfinite && currentIndex >= children.length - 1) return;
    setCurrentIndex((prev) => (prev + 1) % children.length);
  };

  const handlePrev = () => {
    if (!isInfinite && currentIndex <= 0) return;
    setCurrentIndex((prev) => (prev - 1 + children.length) % children.length);
  };

  const runInfinite = () => {
    setInterval(() => {
      setCurrentIndex((prevIndex) => {
        let newIndex = prevIndex + 1;
        if (newIndex === children.length) {
          return 0;
        }
        return newIndex;
      });
    }, scrollInterval);
  };

  const checkCardWidth = () => {
    if (!trackRef.current) return;
    if (!children.length) return;

    const childElements = Array.from(trackRef.current.children);
    let firstChildWidth = childElements[0].children[0].clientWidth;
    const isAllSameWidth = childElements.every(
      (child) => child.children[0].clientWidth === firstChildWidth
    );

    if (!isAllSameWidth) {
      setErrors(
        "The Carousel component should accept multiple children of the same width."
      );
    }
  };

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
    index: number
  ) => {
    const pointX = event.changedTouches[0].screenX;
    setTouchStartPoint(pointX);
  };

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>,
    index: number
  ) => {
    const pointX = event.changedTouches[0].screenX;
    setDeltaX(pointX - touchStartPoint);
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>,
    index: number
  ) => {
    const pointX = event.changedTouches[0].screenX;

    setDeltaX(0);
    if (pointX > touchStartPoint) {
      if (index > 0) setCurrentIndex(index - 1);
    } else if (pointX < touchStartPoint) {
      if (index < children.length) setCurrentIndex(index + 1);
    }
  };

  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.offsetWidth);
    }
    checkCardWidth();
    if (isInfinite) runInfinite();
  }, []);

  return (
    <CarouselContainer>
      {errors ? (
        <ErrorContainer>{errors}</ErrorContainer>
      ) : (
        <React.Fragment>
          <CarouselTrack
            translateX={-currentIndex * trackWidth}
            deltaX={deltaX}
            ref={trackRef}
          >
            {children.map((child, index) => (
              <div
                key={index}
                style={{ minWidth: "100%" }}
                onTouchStart={(event) => handleTouchStart(event, index)}
                onTouchMove={(event) => handleTouchMove(event, index)}
                onTouchEnd={(event) => handleTouchEnd(event, index)}
              >
                {child}
              </div>
            ))}
          </CarouselTrack>
          <CarouselButton
            onClick={handlePrev}
            disabled={!isInfinite && currentIndex === 0}
            style={{ left: 0 }}
            hidden={isInfinite}
          >
            Prev
          </CarouselButton>
          <CarouselButton
            onClick={handleNext}
            disabled={!isInfinite && currentIndex === children.length - 1}
            style={{ right: 0 }}
            hidden={isInfinite}
          >
            Next
          </CarouselButton>
        </React.Fragment>
      )}
    </CarouselContainer>
  );
};

export default Carousel;
