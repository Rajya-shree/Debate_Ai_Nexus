
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Image options for the grid (representing various objects and concepts)
const IMAGE_OPTIONS = [
  { id: 1, src: "https://api.dicebear.com/7.x/icons/svg?seed=apple", alt: "Apple" },
  { id: 2, src: "https://api.dicebear.com/7.x/icons/svg?seed=banana", alt: "Banana" },
  { id: 3, src: "https://api.dicebear.com/7.x/icons/svg?seed=car", alt: "Car" },
  { id: 4, src: "https://api.dicebear.com/7.x/icons/svg?seed=dog", alt: "Dog" },
  { id: 5, src: "https://api.dicebear.com/7.x/icons/svg?seed=elephant", alt: "Elephant" },
  { id: 6, src: "https://api.dicebear.com/7.x/icons/svg?seed=fish", alt: "Fish" },
  { id: 7, src: "https://api.dicebear.com/7.x/icons/svg?seed=guitar", alt: "Guitar" },
  { id: 8, src: "https://api.dicebear.com/7.x/icons/svg?seed=house", alt: "House" },
  { id: 9, src: "https://api.dicebear.com/7.x/icons/svg?seed=icecream", alt: "Ice Cream" },
  { id: 10, src: "https://api.dicebear.com/7.x/icons/svg?seed=jacket", alt: "Jacket" },
  { id: 11, src: "https://api.dicebear.com/7.x/icons/svg?seed=key", alt: "Key" },
  { id: 12, src: "https://api.dicebear.com/7.x/icons/svg?seed=lamp", alt: "Lamp" },
  { id: 13, src: "https://api.dicebear.com/7.x/icons/svg?seed=moon", alt: "Moon" },
  { id: 14, src: "https://api.dicebear.com/7.x/icons/svg?seed=notebook", alt: "Notebook" },
  { id: 15, src: "https://api.dicebear.com/7.x/icons/svg?seed=orange", alt: "Orange" },
  { id: 16, src: "https://api.dicebear.com/7.x/icons/svg?seed=pizza", alt: "Pizza" },
];

interface ImageGridAuthProps {
  mode: 'login' | 'signup';
  onComplete: (selectedImages: number[]) => void;
  size?: 4 | 5; // Grid size: 4x4 or 5x5
}

export function ImageGridAuth({ mode, onComplete, size = 4 }: ImageGridAuthProps) {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [shuffledImages, setShuffledImages] = useState<typeof IMAGE_OPTIONS>([]);
  const maxSelections = 4;

  // Shuffle the images when the component mounts
  useEffect(() => {
    const shuffled = [...IMAGE_OPTIONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, size * size);
    setShuffledImages(shuffled);
  }, [size]);

  const handleImageClick = (imageId: number) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter(id => id !== imageId));
    } else if (selectedImages.length < maxSelections) {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  const handleSubmit = () => {
    if (selectedImages.length === maxSelections) {
      onComplete(selectedImages);
    }
  };

  // Get the image for the preview row
  const getImageById = (id: number) => {
    return IMAGE_OPTIONS.find(img => img.id === id) || IMAGE_OPTIONS[0];
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-2 text-gray-800">
        {mode === 'login' 
          ? 'Visual Authentication' 
          : 'Create Your Visual Passcode'}
      </h2>
      
      <p className="text-sm text-gray-600 mb-4 max-w-md text-center">
        {mode === 'login' 
          ? 'Select your 4 images in the correct sequence to sign in' 
          : 'Choose 4 images in a sequence you will remember to create your unique passcode'}
      </p>
      
      {/* Preview of selected images */}
      <div className="w-full flex justify-center mb-4 h-14">
        {[...Array(maxSelections)].map((_, index) => (
          <div 
            key={index} 
            className={`relative w-12 h-12 mx-1 rounded-md border-2 transition-all duration-300 ${
              selectedImages[index] ? 'border-debate-primary bg-white shadow-md' : 'border-gray-200 bg-gray-50'
            }`}
          >
            {selectedImages[index] && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img 
                  src={getImageById(selectedImages[index]).src} 
                  alt={getImageById(selectedImages[index]).alt}
                  className="w-10 h-10 object-contain"
                />
                <div className="absolute -top-2 -right-2 bg-debate-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      <motion.div 
        className={`grid gap-2 mb-6 p-2 bg-white rounded-lg shadow-inner`}
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` 
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {shuffledImages.map((image) => (
          <motion.button
            key={image.id}
            className={`relative aspect-square p-1 rounded-md border overflow-hidden transition-all duration-200 ${
              selectedImages.includes(image.id)
                ? 'ring-2 ring-debate-primary border-debate-primary bg-debate-primary/5'
                : 'hover:border-gray-400 hover:shadow-md'
            }`}
            onClick={() => handleImageClick(image.id)}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-full object-contain rounded"
            />
            
            {selectedImages.includes(image.id) && (
              <div className="absolute top-1 right-1 bg-debate-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                {selectedImages.findIndex(id => id === image.id) + 1}
              </div>
            )}
          </motion.button>
        ))}
      </motion.div>

      <div className="w-full">
        <Button 
          onClick={handleSubmit}
          disabled={selectedImages.length !== maxSelections}
          className="w-full bg-debate-primary hover:bg-debate-secondary transition-all duration-300"
        >
          {mode === 'login' ? 'Sign In' : 'Create Passcode'}
        </Button>
        <p className="text-sm text-center mt-4 text-gray-500 flex items-center justify-center">
          <span className={`inline-block w-4 h-1 bg-gray-300 rounded-full mx-1 ${selectedImages.length > 0 ? 'bg-debate-primary' : ''}`}></span>
          <span className={`inline-block w-4 h-1 bg-gray-300 rounded-full mx-1 ${selectedImages.length > 1 ? 'bg-debate-primary' : ''}`}></span>
          <span className={`inline-block w-4 h-1 bg-gray-300 rounded-full mx-1 ${selectedImages.length > 2 ? 'bg-debate-primary' : ''}`}></span>
          <span className={`inline-block w-4 h-1 bg-gray-300 rounded-full mx-1 ${selectedImages.length > 3 ? 'bg-debate-primary' : ''}`}></span>
          <span className="ml-2">{selectedImages.length}/{maxSelections} selected</span>
        </p>
      </div>
    </div>
  );
}
