A lib to create and extends React components defining variants like Stitches using Tailwind!

# Summary
1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Heritage](#heritage)
4. [How it works](#how-it-works)
5. [Classes Priority](#classes-priority)
6. [Snippets](#snippets)
7. [Roadmap](#roadmap)

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

# Basic Usage
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
    },
    centralized: {
      //These keys (true and false) are reserved for boolean values 
      // ​or their numerical value (0 and 1)
      true: `justify-center`,
      false: `justify-start`
    }
  },
  defaultVariants: {
    size: "lg",
    theme: "light"
  }
});
```

```tsx
<Container centralized>
  <p>Now you can use it as you wish</p>
</Container>
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
`, {
  ...
})
```

# Heritage
Components receive a function called extends which can be called by passing or not a new component. The first parameter is precisely this new type of component. If null, it will inherit the extended component. Otherwise, it will inherit all properties and variants of the new component.
```tsx
//Example extending the styles
//Note: all factory components have a `extends` function
export const Header = Container.extends(
  null, //Will inherit the properties and variants of Container
`
  flex
  justify-center
  items-center
  w-full
`, {
  variants: {
    theme: {
      dark: `bg-zinc-800`,
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

You can replace the null value with another component:
```tsx
//Example extending another component
export const Header = Container.extends(
  //Will inherit the properties of AnotherComponent 
  // and variants of Container
  AnotherComponent, 
`
  flex
  justify-center
  items-center
  w-full
`, {
  variants: {
    ...
  },
  defaultVariants: {
    ...
  }
});
```

The idea was to make it closer to the 'as' property provided in some libraries. I won't go into details, but I failed to obtain this result and this was my way of mimicking this property.

I'm still wondering if the best way is to keep the extends function together with the components. If you have a problem with this or an idea, you can create an Issue.

# How it works
Tailwind Factory just arranges the classes within the variants according to the properties passed for the component. Tailwind does the rest, so I think you'll have no problem using other forms of styling based on class definitions. Like traditional CSS, Sass, or CSS Modules.

Come to think of it, maybe the name should be Style Factory or Class Factory. But now it's too late... I will keep the name.

Note: Classes are formatted before being passed to components. Reducing the number of spaces between classes to one.

# Classes Priority
1. Inline Classes
2. Factory Variants
3. Extended Factory Variants
4. Factory Styles
5. Extended Factory Styles

# Snippets
Tailwind Factory has an official extension that accompanies some snippets. See in: [`Tailwind Factory Extension`](https://marketplace.visualstudio.com/items?itemName=l-marcel.tailwind-factory)
## List of Snippets:
Documented version: `0.1.0`

`tfi`: Import Tailwind Factory and create a new factory component
```tsx
import { tf } from "tailwind-factory";

export const Container = tf("div", `
  
`, {
  variants: {},
  defaultVariants: {}
});
```

`tfc`: Create a new factory component
```tsx
export const NewComponent = tf("div", `
  
`, {
  variants: {},
  defaultVariants: {}
});
```

`tfe`: Create a new extended factory component
```tsx
export const NewComponent = Parent.extends(ParentComponent, `
  
`, {
  variants: {},
  defaultVariants: {}
});
```

# Roadmap
- [] Deep classes

Spoiler:
```tsx
const Container = tf(
  "div",
  `
  text-red-300

  @h2 {
    text-6xl
  }

  @> h2 {
    text-red-300
  }
`
);
```