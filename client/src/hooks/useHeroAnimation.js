import { useMemo } from "react";

const useHeroAnimation = () => {
  const containerVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.2,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: 24,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    }),
    []
  );

  const floatingVariants = useMemo(
    () => ({
      animate: {
        y: [0, -8, 0],
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    }),
    []
  );

  return {
    containerVariants,
    itemVariants,
    floatingVariants,
  };
};

export default useHeroAnimation;