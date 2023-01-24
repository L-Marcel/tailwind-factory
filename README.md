A lib to create and extends React components like stitches using Tailwind classes!

# Installation
First, you need to install (https://tailwindcss.com/docs/installation)[Tailwind]!

To install Tailwind Factory you need to run in your project:
```
//Using pnpm
pnpm add tailwind-factory

//Using npm
npm install tailwind-factory

//Using yarn
yarn add tailwind-factory
```

Now, you need to install the (https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)[Tailwind CSS IntelliSense] and add the following configuration:
```json
//Tailwind IntelliSense Regex
"tailwindCSS.experimental.classRegex": [
  ["tf\\(([^)]*)\\)", "(?:`)([^'\"`]*)(?:`)"], // tf(`...`)
  ["\\.extends\\(([^)]*)\\)", "(?:`)([^'\"`]*)(?:`)"], // xxx.extends(`...`)
],
```

# Usage
```tsx
import { tf } from "tailwind-factory";

//Example of a common use case
//Note: use ` to use Tailwind CSS IntelliSense
// and " or ' to use the properties' autocomplete
export const Container = tf("div", `
  flex
  flex-col
`, {
  variants: {
    theme: {
      dark: `bg-zinc-800 text-zinc-100`,
      light: `bg-white text-zinc-800`
    },
    size: {
      md: `w-full h-[200px]`,
      lg: `w-full h-screen`
    }
  },
  defaultVariants: {
    size: "lg",
    theme: "light"
  }
});
```

Tailwind Factory also support custom components:
```tsx
//Example using a custom JSX component
const JSXTitle = (
  //The component need to have the className property!
  { children, className }: { 
    children: ReactNode, 
    className?: string 
  }
) => <h2 className={className}>
{children}
</h2>;

//Is recommended create the component outside the function
// to prevent a bug with Tailwind CSS IntelliSense
export const Title = tf(JSXTitle, `
  text-3xl
  text-inherit
`, {})
```

You can extends styles too:
```tsx
//Example extending the styles
//Note: all styled components have a `extends` function
export const Header = Container.extends(`
  flex
  justify-center
  items-center
  w-full
`, {
  variants: {
    theme: {
      dark: `bg-zinc-900 text-zinc-100`,
      light: `bg-white text-zinc-800`
    },
    border: {
      enabled: `border-b-4 border-zinc-600`,
      disabled: `text-6xl`
    },
    size: {
      sm: `h-[20%]`
    }
  },
  defaultVariants: {
    theme: "light",
    border: "enabled",
    size: "sm"
  }
});
```

### Roadmap 
- [x] Create a styled component
- [x] Add a method to extends a styled component
- [x] Tailwind intellisense support
- [x] Snippets
- [] Improve default variants types' check
- [] Add all tests
- [] Add a property to interpolate variants