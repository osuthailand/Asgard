"use client";

import { Button } from "@nextui-org/react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return theme === "light" ? (
        <Button isIconOnly variant="bordered" aria-label="Turn on dark mode" onPress={() => setTheme("dark")}>
            <IconMoon size="18" />
        </Button>
    ) : (
        <Button isIconOnly variant="bordered" aria-label="Turn on light mode" onPress={() => setTheme("light")}>
            <IconSun size="18" />
        </Button>
    );
}