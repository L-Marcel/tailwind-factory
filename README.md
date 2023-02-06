
[![image info](./web/public/logo.png)](https://github.com/l-marcel/tailwind-factory)

A lib to create and extends React components defining variants like Stitches using Tailwind!

# WARNING
Sorry version number, got a big error uploading the prerelease. I'm creating a plugin for this application. It was inexperience.

Download the alpha version at your own risk, it is still undocumented and has changed a lot. I'm making it available to perform tests in the production environment.

# Summary
1. [Installation](#installation)
   1. [Tailwind Configuration](#tailwind-configuration)
2. [Basic Usage](#basic-usage)
   1. [Custom components](#custom-components)
3. [Heritage](#heritage)
4. [[Experimental] Deep Classes](#experimental-deep-classes)
   1. [Available syntaxes](#available-syntaxes)
   2. [Unavailable syntaxes](#unavailable-syntaxes)
   3. [Tailwind Group](#tailwind-group)
   4. [Using with variants](#using-with-variants)
5. [How it works](#how-it-works)
6. [Classes Priority](#classes-priority)
7. [Snippets](#snippets)
9. [Roadmap](#roadmap) - updated

# Installation
To install Tailwind Factory you need to run in your project:
```
//Using pnpm
pnpm add tailwind-factory

//Using npm
npm install tailwind-factory

//Using yarn
yarn add tailwind-factory
```

### Tailwind Configuration
If you want to use with Tailwind you need to install and configure [`Tailwind`](https://tailwindcss.com/docs/installation/) before!

To use [`Tailwind CSS IntelliSense`](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) you need to add the following configuration in your User Settings:
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
Components receive a function called __`extends`__ which can be called by passing or not a new component. The first parameter is precisely this new type of component. If __`null`__, it will __`inherit`__ the extended component. Otherwise, it will __`inherit`__ all properties and variants of the new component.
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

You can replace the null value with __`another component`__:
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

The idea was to make it closer to the __`'as'`__ property provided in some libraries. I won't go into details, but I failed to obtain this result and this was my way of __`mimicking`__ this property.

I'm still wondering if the best way is to keep the extends function together with the components. If you have a problem with this or an idea, you can create an Issue.

# [Experimental] Deep Classes
In some cases, to avoid creating __`multiple components`__ you can use a syntax similar to __`CSS`__:
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
To inject by __`tag`__:
```scss
div {
  bg-red-500

  h1 {
    text-gray-200
  }
}
```

To inject by __`class`__:
```scss
.hero {
  bg-red-500

  h1 {
    text-gray-200
  }
}
```
On inject by class __`expected classes`__ are __`saved`__, but are sent to the beginning of the class list. It is understood, in this case, that the __`expected classes`__ cannot overlap with other classes and variants of Tailwind Factory.

To inject by __`id`__:
```scss
#hero {
  bg-red-500

  h1 {
    text-gray-200
  }
}
```

To inject into __`multiple`__:
```scss
#hero, section, header, .title  {
  bg-red-500

  h1 {
    text-gray-200
  }
}
```

To inject only in the __`first group`__ of __`children`__ inside the component (support __`multiple`__ syntax):
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
First, this __`deep class`__ approach is not the same as defining classes in a typical __`style file`__! Some things like checking states is not supported. Example with __`:hover`__:
```scss
//not work!
div:hover {
  h2 {
    text-red-500
  }
}
```
This happens because __`Tailwind Factory`__ only works with __`class management`__! You can get around this by defining your classes in a __`styling file`__.

### Tailwind Group
In some cases, a __`group`__ in Tailwind is the sufficient to set up a __`hover`__:
```scss
//work!
div {
  group
  hover:bg-gray-500
  h2 {
    group-hover:text-red-500
  }
}
```

In other cases you may prefer to use external classes:
```scss
//style.scss
//With Tailwind (you can use the common CSS too)
.custom-class:hover {
  h2 {
    @apply
      text-red-500;
  }
}
```
```scss
//work too!
div {
  hover:bg-gray-500
  custom-class
}
```

### Using with variants
The __`variants`__ support __`deep classes`__:
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

You can __`extends`__ too:
```tsx
const Hero = Container.extends(null, `
  h1 {
    text-9xl
  }
`);
```

# How it works
Tailwind Factory just __`arranges`__ the classes within the variants according to the properties passed for the component. Tailwind does the rest, so I think you'll have no problem using other forms of styling based on __`class`__ definitions. Like traditional __`CSS`__, __`Sass`__, or __`CSS Modules`__.

Come to think of it, maybe the name should be Style Factory or Class Factory. But now it's too late... I will keep the name.

Note: Classes are formatted before being passed to components. Reducing the number of spaces between classes to one.

# Classes Priority
1. Inline Classes
2. Factory Variants
3. Extended Factory Variants
4. Factory Styles
5. Extended Factory Styles
6. Inline Saved Classes 
   - Inline Classes used in Deep Classes

# Snippets
Tailwind Factory has an official extension that accompanies some snippets. See in: [`Tailwind Factory Extension`](https://marketplace.visualstudio.com/items?itemName=l-marcel.tailwind-factory)

## List of Snippets:
Documented version: __`0.1.0`__

__`tfi`__: Import Tailwind Factory and create a new factory component
```tsx
import { tf } from "tailwind-factory";

export const Container = tf("div", `
  
`, {
  variants: {},
  defaultVariants: {}
});
```

__`tfc`__: Create a new factory component
```tsx
export const NewComponent = tf("div", `
  
`, {
  variants: {},
  defaultVariants: {}
});
```

__`tfe`__: Create a new extended factory component
```tsx
export const NewComponent = Parent.extends(ParentComponent, `
  
`, {
  variants: {},
  defaultVariants: {}
});
```

# Roadmap
First, I repeat: sorry version number, got a big error uploading the prerelease.

- [ ] Finish plugin
  - Full deep classes support 
- [ ] Release 2.3.0 version
- [ ] Add custom colors in extensio