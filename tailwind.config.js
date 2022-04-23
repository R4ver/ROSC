/* eslint-disable */
const colors = {
    offWhite: "#f5f7fb",
    white: "#fff",
    black: "#0C0F13",
    red: "#f7193e",
};

module.exports = {
    purge: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    darkMode: "class",
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
