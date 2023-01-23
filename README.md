An lib to create components like stitches using Tailwind classes!

# Installation
```json
//Tailwind IntelliSense Regex
"tailwindCSS.experimental.classRegex": [
    ["tf\\(([^)]*)\\)", "(?:`)([^'\"`]*)(?:`)"], // tf(`...`)
],
```

# Usage
```tsx
export const Container = tf("div", `
  flex
  justify-center
  items-center
`, {
  variants: {
    theme: {
      blue: `
      bg-blue-300
      `,
      green: `
        bg-green-300
      `
    },
    size: {
      sm: `w-full h-[200px]`,
      lg: `w-full h-screen min-h-[500px]`
    }
  },
  defaultVariants: {
    size: "lg"
  }
})
```

Tailwind Factory also support custom components:
```tsx
export const Header = tf(Container, `
  flex
  justify-center
  items-center
  w-full
  h-full
`, {
  variants: {
    theme: {
      blue: `
        bg-blue-200
      `,
      green: `
        bg-green-200
      `
    }
  },
  defaultVariants: {
    size: "sm"
  }
})
```