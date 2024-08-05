const colorsHSL = [
    "205, 100%, 68%", // #49C4E5
    "275, 59%, 58%", // #9370DB
    "261, 68%, 56%", // #FFD700
    "120, 61%, 50%", // #32CD32
    "9, 100%, 67%", // #FF6347
    "160, 100%, 75%", // #7FFFD4
    "288, 58%, 64%", // #BA55D3
    "33, 100%, 50%", // #FF8C00
    "176, 71%, 47%", // #20B2AA
    "206, 92%, 80%", // #87CEFA
    "334, 92%, 61%", // #87CEFA

  ];


  
  export const generatedColor = (string:string) => {
    const color = colorsHSL[string.length % colorsHSL.length];
    return `hsl(${color})`;
  };