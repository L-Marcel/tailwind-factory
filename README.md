A lib to create and extends React components defining variants like Stitches using Tailwind!

# Summary
1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
   1. [Custom components](#custom-components)
3. [Heritage](#heritage)
4. [Deep Classes](#experimental-deep-classes)
   1. [Available syntaxes](#available-syntaxes)
   2. [Unavailable syntaxes](#unavailable-syntaxes)
   3. [Using with variants](#using-with-variants)
5. [How it works](#how-it-works)
6. [Classes Priority](#classes-priority)
7. [Snippets](#snippets)
8. [Roadmap](#roadmap)

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

Use case:
```tsx
<Container centralized>
  <p>Now you can use it as you wish</p>
</Container>
```

### Custom components
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

# [Experimental] Deep Classes

In some cases, to avoid creating multiple components you can use a syntax similar to CSS:
```tsx
//Deep classes example
const Container = tf(
  "div",
  `
  bg-lime-200
  w-4

  h2 {
    italic
  }

  div {
    h-3
  }

  > div {
    flex
    flex-col
    bg-blue-200
    > h2 {
      font-bold
    }

    h2 {
      text-6xl
    }
  }

  > h2, h1, p {
    text-red-400
  }
`);
```

Example of component structure:
```tsx
<Container>
  <h1>Red Title</h1>
  <h2>Red</h2>
  <p>Red Text</p>
  <div>
    <h2>Normal</h2>
    <div className="hover:bg-red-300">
      <h2>Normal</h2>
    </div>
  </div>
</Container>
```

Example output:
```html
<div class="bg-lime-200 w-4">
  <h1 class="text-red-400">Red Title</h1>
  <h2 class="italic text-red-400">Red</h2>
  <p class="text-red-400">Red Text</p>
  <div class="h-3 flex flex-col bg-blue-200">
    <h2 class="italic font-bold text-6xl">Normal</h2>
    <div class="h-3 hover:bg-red-300">
      <h2 class="italic text-6xl">Normal</h2>
    </div>
  </div>
</div>
```

### Available syntaxes
To inject by `tag`:
```scss
div {
  bg-red-500

  h1 {
    text-gray-200
  }
}
```

To inject by `class`:
```scss
.hero {
  bg-red-500

  h1 {
    text-gray-200
  }
}
```

To inject by `id`:
```scss
#hero {
  bg-red-500

  h1 {
    text-gray-200
  }
}
```

To inject into `multiple`:
```scss
#hero, section, header, .title  {
  bg-red-500

  h1 {
    text-gray-200
  }
}
```

To inject only in the `first group` of `children` inside the component (support `multiple` syntax):
```scss
> div {
  bg-red-500

  h1 {
    text-gray-200
  }

  > .main, input {
    rounded-md
  }
}
```

### Unavailable syntaxes
First, this `deep class` approach is not the same as defining classes in a typical `style file`! Some things like checking states like the `hover` is not supported:
```scss
//not work!
div:hover {
  h2 {
    text-red-500
  }
}
```

This happens because `Tailwind Factory` only works with `class management`! You can get around this by defining your classes in a `styling file`. In some cases the Tailwind is the sufficient:
```scss
//With Tailwind (you can use the common CSS too)
.custom-class:hover {
  h2 {
    @apply
      text-red-500;
  }
}
```
```scss
//work!
div {
  hover:bg-gray-500
  custom-class
}
```

### Using with variants
The `variants` support `deep classes`:
```tsx
const Container = tf(
  "div",
  `
  bg-lime-200
  w-4
`, {
  variants: {
    italic: {
      true: `
        h1, h2, h3 {
          italic
        }

        a {
          no-underline
        }
      `,
      false: `
        h2 {
          underline
        }
      `
    }
  },
  defaultVariants: {
    italic: false
  }
});
```

You can `extends` too:
```tsx
const Hero = Container.extends(null, `
  h1 {
    text-9xl
  }
`);
```

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
- Nothing here.