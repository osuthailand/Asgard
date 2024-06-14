"use client";

import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";

import { MdDarkMode, MdLightMode } from "react-icons/md";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return theme === "light" ? (
        <Button isIconOnly variant="bordered" aria-label="Turn on dark mode" onPress={() => setTheme("dark")}>
            <MdDarkMode />
        </Button>
    ) : (
        <Button isIconOnly variant="bordered" aria-label="Turn on light mode" onPress={() => setTheme("light")}>
            <MdLightMode />
        </Button>
    );
}