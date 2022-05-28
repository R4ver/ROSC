/* eslint-disable */
const colors = {
    pureWhite: "#FFF",
    pureBlack: "#000",
    white: "#FBFBFB",
    black: "#1C1E21",
    blackHighlight: "#9295A0",
    blackDarker: "#0D0E11",
    red: "#F7193E",
};

module.exports = {
    darkMode: "class",
    content: [
        './src/**/*.{html,js,tsx,jsx}',
    ],
    theme: {
        container: {
            center: true,
        },

        fontFamily: {
            lato: ["Lato", "sans-serif"],
            openSans: ["Open Sans", "sans-serif"],
        },

        extend: {
            colors: {
                ...colors,
                bgColor: colors.offWhite,
                textColor: colors.black,
                brand: colors.red,
            },

            lineHeight: {
                0: "0",
            },

            maxWidth: {
                "main-content": "960px",
            },

            contrast: {
                110: "1.1",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
       
    ],
};
