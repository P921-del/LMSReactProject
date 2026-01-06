export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                slideInLeft: 'slideInLeft ease-in-out 1.5s'
            },
            keyframes: {
                slideInLeft: {
                    '0%': {
                        opacity: '0'
                    },
                    '100%': {
                        opacity: '1',
                        left: 0
                    }
                }
            }

        },
    },
    plugins: [],
};
