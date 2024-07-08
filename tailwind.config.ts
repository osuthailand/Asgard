import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            screens: {
                "-2xl": { max: "1535px" },
                "-xl": { max: "1279px" },
                "-lg": { max: "1023px" },
                "-md": { max: "767px" },
                "-sm": { max: "639px" },
            },
        },
    },
    plugins: [
        nextui({
            defaultTheme: "dark",
            themes: {
                
                dark: {
                    colors: {
                        background: "#0c0c0e",
                    }
                }
            }
        })
    ],
};
export default config;
