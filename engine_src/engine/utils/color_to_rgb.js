function colorToRGBA(colorName) {
    const colorMap = {
      red: [255, 0, 0, 1],
      green: [0, 255, 0, 1],
      blue: [0, 0, 255, 1],
      black: [0, 0, 0, 1],
      white: [255, 255, 255, 1],
      yellow: [255, 255, 0, 1],
      orange: [255, 165, 0, 1],
      purple: [128, 0, 128, 1],
      pink: [255, 192, 203, 1],
      gray: [128, 128, 128, 1],
      // Add more color mappings as needed
    };
  
  
    if (colorMap.hasOwnProperty(colorName)) {
      return colorMap[colorName];
    } else {
      console.error(`Color "${colorName}" not found in the color map.`);
      return null;
    }
  }

export default colorToRGBA