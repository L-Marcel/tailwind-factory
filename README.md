A lib to create and extends React components defining variants like Stitches using Tailwind!

# Summary
1. [Installation](#installation)
2. [Usage](#usage)
3. [Snippets](#snippets)
4. [Roadmap](#roadmap)

# Installation
First, you need to install and configure [`Tailwind`](https://tailwindcss.com/docs/installation/)!

To install Tailwind Factory you need to run in your project:
```
//Using pnpm
pnpm add tailwind-factory

//Using npm
npm install tailwind-factory

//Using yarn
yarn add tailwind-factory
```

Now, you need to install the [`Tailwind CSS IntelliSense`](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss/) and add the following configuration:
```js
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
//Note: all factory components have a `extends` function
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
      true: `border-b-4 border-zinc-600`,
      false: ``
    },
    size: {
      sm: `h-[20%]`
    }
  },
  defaultVariants: {
    //theme: "light", is not necessary
    border: true, //can be a string
    size: "sm"
  }
});
```

## Snippets
Tailwind Factory has an official extension that accompanies some snippets. See in: [`Tailwind Factory Extension`](https://marketplace.visualstudio.com/items?itemName=l-marcel.tailwind-factory)

## Roadmap 
- [x] Create a factory components
- [x] Add a method to extends a factory component
- [x] Tailwind intellisense support
- [x] Snippets
- [X] Improve default variants types' check
- [ ] Add all tests
- [ ] Add interpolated variants
- [ ] Add `as` property in factory components
- [ ] Separate factory components `extends` function