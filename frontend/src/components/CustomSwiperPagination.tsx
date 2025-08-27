import React from 'react';

interface CustomSwiperPaginationProps {
  totalSlides: number;
  activeIndex: number;
  onSlideChange: (index: number) => void;
  isLoop?: boolean;
}

const CustomSwiperPagination: React.FC<CustomSwiperPaginationProps> = ({
  totalSlides,
  activeIndex,
  onSlideChange,
  isLoop = true
}) => {
  // Calculate which bullets to show (always 5 bullets if totalSlides > 5)
  const getBulletIndices = () => {
    if (totalSlides <= 5) {
      return Array.from({ length: totalSlides }, (_, i) => i);
    }

    // Always show 5 bullets with active in center
    let start = activeIndex - 2;
    let end = activeIndex + 2;

    // Adjust for boundaries
    if (start < 0) {
      start = 0;
      end = 4;
    } else if (end >= totalSlides) {
      end = totalSlides - 1;
      start = totalSlides - 5;
    }

    return Array.from({ length: 5 }, (_, i) => start + i);
  };

  const bulletIndices = getBulletIndices();

  // Get bullet size based on position relative to active
  const getBulletSize = (index: number) => {
    const distance = Math.abs(index - activeIndex);

    if (distance === 0) return 'w-4 h-4'; // Active - largest
    if (distance === 1) return 'w-3 h-3'; // Adjacent - medium
    return 'w-2.5 h-2.5'; // Far - smallest
  };

  // Get bullet opacity based on position
  const getBulletOpacity = (index: number) => {
    const distance = Math.abs(index - activeIndex);

    if (distance === 0) return 'opacity-100'; // Active
    if (distance === 1) return 'opacity-80'; // Adjacent
    return 'opacity-50'; // Far
  };

  const handleBulletClick = (index: number) => {
    onSlideChange(index);
  };

  return (
    <div className="flex items-center justify-center mt-8">
      {/* Bullets Container */}
      <div className="flex items-center gap-2">
        {bulletIndices.map((slideIndex, bulletIndex) => {
          const isActive = slideIndex === activeIndex;

          return (
            <button
              key={slideIndex}
              onClick={() => handleBulletClick(slideIndex)}
              className={`
                ${getBulletSize(slideIndex)}
                ${getBulletOpacity(slideIndex)}
                ${isActive
                  ? 'bg-maroon-600 shadow-lg shadow-maroon-200 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
                }
                rounded-full transition-all duration-300 cursor-pointer
                hover:scale-110 active:scale-95
              `}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CustomSwiperPagination;
