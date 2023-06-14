
[![image info](./web/public/logo.png)](https://github.com/l-marcel/tailwind-factory)

A lib to create and extends React components defining variants like Stitches and using Tailwind classes!

# Summary
1. [Installation](#installation)
   1. [Run without plugin](#run-without-plugin)
      1. [Advantages](#advantages)
      2. [Disadvantages](#disadvantages)
   2. [Tailwind configuration](#tailwind-configuration)
   3. [Plugin configuration](#plugin-configuration)
      1. [Plugin options](#plugin-options)
      2. [With Next](#with-next)
      3. [With Webpack](#with-webpack)
2. [Basic usage](#basic-usage)
   1. [Custom components](#custom-components)
3. [Heritage](#heritage)
4. [Deep classes](#deep-classes)
   1. [Available syntaxes](#available-syntaxes)
   2. [Is it possible to use external classes?](#is-it-possible-to-use-external-classes)
   3. [Tailwind group](#tailwind-group)
   4. [Using with variants](#using-with-variants)
5. [Classes priority](#classes-priority)
6. [How it works](#how-it-works)
7. [Extension](#extension)
   1. [Color tokens](#color-tokens)
   2. [Snippets](#snippets)

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

## Run without plugin
You can run Tailwind Factory without its plugin. It's faster in many cases.

I will list here some __`advantages`__ and __`disadvantages`__ of running Tailwind Factory without the plugin:

### Advantages
- Extremely fastest in development (because it will not be depending on the library's own cache to be checking the style of unchanged files);
- Fastest build (because you won't be using __`Babel`__);
- Support external classes (which do not belong to __`Tailwind`__);
- It doesn't generate a styling file (it doesn't actually need one);
- Specific classes of Tailwind may work better (because I don't have conditions to go out checking class by class).

### Disadvantages
- Extremely limited Deep Classes support;
- Styles generated within Deep Classes will only be applied to the parent component's children, not to other child components. It works on the childrens of a HTML tag;
- Costs a little more memory on the __`Client-Side`__, mainly if you are using Deep Classes resources.

## Tailwind configuration
Now you should install and configure [Tailwind](https://tailwindcss.com/docs/installation/)!

To use [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) you need to add the following configuration in your User Settings:
```js
//Tailwind IntelliSense Regex
"tailwindCSS.experimental.classRegex": [
  ["tf\\(([^)]*)\\);", "(?:`)([^'\"`]*)(?:`)"], // tf(`...`);
  ["\\.__extends\\(([^)]*)\\);", "(?:`)([^'\"`]*)(?:`)"], // xxx.extends(`...`);
],
```

In this case it is necessary to put a __`semicolon`__ at the end of the function call. Using the [snippets](#snippets) you will not suffer from this. It already puts the __`semicolon`__.

If you don't like the idea very much (what do you mean you didn't come from Java, just kidding) you can use the old regex from the library, but you'll have problems if you call a __`parenthesis`__ inside the function if you do. Also, you will have problems with the __`colors highlight`__ set by the __`plugin`__ if you are using it.

Still, I'll leave it here:
```js
//Tailwind IntelliSense Olg Regex
"tailwindCSS.experimental.classRegex": [
  ["tf\\(([^)]*)\\)", "(?:`)([^'\"`]*)(?:`)"], // tf(`...`)
  ["\\.__extends\\(([^)]*)\\)", "(?:`)([^'\"`]*)(?:`)"], // xxx.extends(`...`)
],
```

## Plugin configuration
Tailwind Factory has its own __`Babel`__ plugin that is used to generate the styles that are already included with the library. To use it you will need to provide it in your babel configuration file:
```js
//babel.config.js
module.exports = (api) => {
  //Can be true, but I haven't tested the effects.
  api.cache(false); 
  
  return {
    //...
    plugins: [
      //...,
      [
        "tailwind-factory/plugin",
        {
          logs: "normal",
          styles: {
            config: require("./tailwind.config"),
            outputPath: "src/styles/generated.css"
          },
        },
      ],
    ],
  };
};
```

If you want to pass your __`Tailwind`__ configuration the babel file has to export a __`JavaScript`__ module so that you can pass your configuration using require. You can also pass the configuration directly, but this will limit you further.

### Plugin options
```ts
//types definition
export type PluginType = {
  preset?: "react"; //In case you need it someday
  logs?: "none" | "all" | "normal" | "debug" | "errors";
  styles?: {
    outputPath?: string;
    inputPath?: string; //Disabled
    config?: Promise<TailwindConfig | undefined>;
  };
};
```
- __`logs`__ - How the plugin should print the log, see the presets:
  - __`"none"`__ - the plugin will not output or format any logs;
  - __`"all"`__ - the plugin will output and format any logs, except debug logs;
  - __`"normal"`__ - (default) the plugin will output and format some logs, except debug logs;
  - __`"debug"`__ - the plugin will output and format some logs, including debug logs;
  - __`"errors"`__ - the plugin will output and format only error logs.

- __`styles.config`__ - Tailwind config (default: {});
- __`styles.outputPath`__ - Path to put the generated styles (default: "src/styles/generated.css"). The file should be created before. 

### With Next
Edit your Next configuration file so it understands which files are important for the plugin:
```js
//next.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
const { nextWithFactory } = require("tailwind-factory");

module.exports = nextWithFactory({
  reactStrictMode: true,
  //...
});
```

Import the __`generated styles`__ file and the __`Tailwind`__ configuration into one of the first files to be called before __`rendering`__ (the import has to come before any __`components`__ created by the library).

Common example in Next:
```tsx
//src/pages/_app.tsx
import type { AppProps } from "next/app";

import "../../tailwind.config";
import "../styles/generated.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

### With Webpack
Edit your Webpack configuration file so it understands which files are important for the plugin:
```js
//webpack.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
const { webpackWithFactory } = require("tailwind-factory");

module.exports = webpackWithFactory({
  //...
});
```

Import the __`generated styles`__ file and the __`Tailwind`__ configuration into one of the first files to be called before __`rendering`__ (the import has to come before any __`components`__ created by the library).
```tsx
import "../../tailwind.config";
import "../styles/generated.css";
```

# Basic Usage
```tsx
import { tf } from "tailwind-factory";

//Example of a common use case
//Note: use ` to use Tailwind CSS IntelliSense
// and " or ' to use the properties' autocomplete
export const Container = tf("div", `flex flex-col`, 
{
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
});
```

# Heritage
Components receive a function called __`__extends`__ which can be called by passing or not a new component. The first parameter is precisely this new type of component. If __`null`__, it will __`inherit`__ the extended component. Otherwise, it will __`inherit`__ all properties and variants of the new component.
```tsx
//Example extending the styles
//Note: all factory components have a `__extends` function
export const Header = Container.__extends(
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
export const Header = Container.__extends(
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

# Deep classes
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

    .test {
      text-6xl
    }
  }

  > h2, > h1, p {
    text-red-400
  }
`);
```

Plugin generated styles example:
```css
.factory__52dad3ab6fb6 {
  width: 1rem;
}
.factory__52dad3ab6fb6 {
  --tw-bg-opacity: 1;
  background-color: rgb(217 249 157/var(--tw-bg-opacity));
}
.factory__52dad3ab6fb6 h2 {
  font-style: italic;
}
.factory__52dad3ab6fb6 div {
  height: 0.75rem;
}
.factory__52dad3ab6fb6 > div {
  display: flex;
}
.factory__52dad3ab6fb6 > div {
  flex-direction: column;
}
.factory__52dad3ab6fb6 > div {
  --tw-bg-opacity: 1;
  background-color: rgb(191 219 254/var(--tw-bg-opacity));
}
.factory__52dad3ab6fb6 > div > h2 {
  font-weight: 700;
}
.factory__52dad3ab6fb6 > div .test {
  font-size: 3.75rem;
  line-height: 1;
}
.factory__52dad3ab6fb6 > h2, .factory__52dad3ab6fb6 > h1, .factory__52dad3ab6fb6 p {
  --tw-text-opacity: 1;
  color: rgb(248 113 113/var(--tw-text-opacity));
}
```

Component structure example:
```tsx
<Container>
  <h1>Red Title</h1>
  <h2>Red</h2>
  <p>Red Text</p>
  <div>
    <h2 className="test">Normal</h2>
    <div className="hover:bg-red-300">
      <h2>Normal</h2>
    </div>
  </div>
</Container>
```

Output example (with plugin):
```html
<div class="factory__52dad3ab6fb6">
  <h1>Red Title</h1>
  <h2>Red</h2>
  <p>Red Text</p>
  <div>
    <h2 className="test">Normal</h2>
    <div class="hover:bg-red-300">
      <h2>Normal</h2>
    </div>
  </div>
</div>
```

### Available syntaxes
> Know that spaces between values ​​count here. The way Tailwind Factory separates classes is very much related to the use of commas and the space between classes. I don't mean the tabs, but it's good to pay attention to the details.

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
> On run without plugin the inject by class __`expected classes`__ are __`saved`__, but are sent to the beginning of the class list. It is understood, in this case, that the __`expected classes`__ cannot overlap with other classes and variants of Tailwind Factory.

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

  //Need to repeat the '>' to apply in all
  //Repeat is unnecessary if you are not using the plugin
  > .main, > input {
    rounded-md
  }

  //Just #all receive '>'
  > #alt, textarea {
    rounded-lg
  }
}
```

Inject with __`pseudo classes`__ (need plugin):
```scss
:hover {
  p:first-of-type {
    text-sm
  }
}

div:focus {
  rounded-md
  border-2
}
```
> This __`first focus`__ is not applied to everyone, but to the component created by the function.

Inject into __`all`__ (need plugin):
```scss
*:focus {
  p:first-of-type {
    text-sm
  }
}
```

Inject with __`media query`__ (need plugin):
```scss
//work
md:rounded-md
p:first-of-type {
  md:text-red-500
}

//work
@media(min-width:900px) {
  w-6
  p:first-of-type {
    text-red-400

    @media(min-width:100px) {
      text-blue-500
    }
  }
}
```

Inject with __`arbitrary`__ value:
```diff
max-w-[30rem]
text-[#5a74db]
```

### Is it possible to use external classes?
Tailwind Factory __`with plugin`__ does NOT support external classes (not part of Tailwind) in function call. However, you can still call a class by passing it directly to the component:
```html
<div className="custom-class"/>
```
> The idea is that you don't need to use this, since within the function call itself you can __`declare`__ a class even within __`variants`__. I even tried to make the Tailwind Factory style syntax closer to __`CSS`__ syntax and not be __`too`__ limited.


### Tailwind Group
In some cases, a __`group`__ in Tailwind is the sufficient to set up a __`hover`__ (I consider this a good practice):
```scss
div {
  group
  hover:bg-gray-500
  h2 {
    group-hover:text-red-500
  }
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

You can __`__extends`__ too:
```tsx
const Hero = Container.__extends(null, `
  h1 {
    text-9xl
  }
`);
```

# Classes Priority
1. Inline Classes
2. Factory Variants
3. Extended Factory Variants
4. Factory Styles
5. Extended Factory Styles
6. Inline Saved Classes 
   - [Without plugin] Inline Classes used in Deep Classes

# How it works
Tailwind Factory (without the plugin) just __`arranges`__ the classes within the variants according to the properties passed for the component. The __`plugin`__ does the rest, checks the __`changed file`__, gets the __`classes`__, transforms the classes using __`Tailwind`__, preprocesses the styles with __`Postcss`__ and __`Sass`__, puts the processed styles into the __`cache`__, loads the cache (which contains the other styles) and __`generates`__ the file with all the styles.

The cache is tied to the component's __`style parameter`__ and its __`variants`__, not the __`deep classes`__ within the component's styles.

At the moment it is inevitable that, if you change any parameter of the function that brings __`style`__, a __`flash`__ will occur in its __`rendering`__. There is no way for this to happen in __`production`__, because it is not possible to pass parameters within the styles defined in the function (this will probably cause an error in the plugin). The __`variants`__ serve to reduce this limitation.

This flash happens because when a change is made the name of the __`class`__ linked to the style parameter or component variant will change. So, since it's faster to change the __`class`__ name than to load the change into the __`style sheet`__, the components that haven't changed will keep their styles (since their class name won't change) while the one with the changed class will __`wait`__ it will be generated by the plugin and loaded by the browser with a class that doesn't exist __`yet`__.

Generating style names __`earlier`__ was actually a way around Babel's limitations. It was not designed/structured to support __`asynchronous functions`__ because that reduces performance and slows down rendering. And, in fact, the Tailwind Factory plugin is very __`heavy`__ and needs your time to generate the component styles, this is a __`limitation`__ of the library itself.

> I am providing only what I __`can`__ and with sincerely.

# Extension
Tailwind Factory has an official extension that accompanies some snippets. See in: [`Tailwind Factory Extension`](https://marketplace.visualstudio.com/items?itemName=l-marcel.tailwind-factory)

Documented version: __`1.2.0`__

> __`Warning`__: it is important that you put the semicolon at the end of the function!

## Color tokens
> All detected errors identifying classes fixed

- `entity.factory.style`: __#91c26e__
- `entity.factory.symbol`: __#abb3c0__
- `entity.factory.style.internal.class`: __#d7c075__
- `entity.factory.style.html.tag`: __#da6f77__
- `entity.factory.style.pseudo`: __#ba7de6__ / italic
- `entity.factory.style.rule`: __#c16bff__ / italic / bold
- `entity.factory.style.internal.id`: __#7d8be6__
- `entity.factory.style.number`: __#efba89__
- `entity.factory.style.unit`: __#eda460__ / italic

You can change the colors in your VSCode configuration:
```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "entity.factory.style",
        "name": "Factory Style",
        "settings": {
          "foreground": "#91c26e"
        }
      }
    ]
  }
}
```

## Snippets
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
export const NewComponent = Parent.__extends(ParentComponent, `
  
`, {
  variants: {},
  defaultVariants: {}
});
```