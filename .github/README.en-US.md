<div valing="top">
  <h1>Tailwind <span>Factory</span></h1>
  <p>A lib to create and extends React components defining variants like Stitches using Tailwind!</p>
  <nav>
    <div id="repository-buttons"/>
    <a class="navigation-link disabled" href="https://github.com/L-Marcel/l-marcel/blob/main/README.md" target="__blank__">
      pt-br
    </a>
    <span class="disabled">•</span>
    <a class="navigation-link" href="https://www.npmjs.com/package/tailwind-factory" target="__blank__">
      npm
    </a>
  </nav>
</div>

<br/>

<p>First, you need to install and configure <a href="https://tailwindcss.com/docs/installation/" target="__blank__">
Tailwind</a>!</p>

<p>To install Tailwind Factory you need to run in your project:</p>

<pre><code>//Using pnpm
pnpm add tailwind-factory

//Using npm
npm install tailwind-factory

//Using yarn
yarn add tailwind-factory
</code></pre>

<p>Now, you need to install the <a href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss/" target="__blank__">
Tailwind CSS IntelliSense</a> and add the following configuration:</p>

<pre lang="tsx"><code lang="tsx">//Tailwind IntelliSense Regex
"tailwindCSS.experimental.classRegex": [
  ["tf\\(([^)]*)\\)", "(?:`)([^'\"`]*)(?:`)"], // tf(`...`)
  ["\\.extends\\(([^)]*)\\)", "(?:`)([^'\"`]*)(?:`)"], // xxx.extends(`...`)
],</code></pre>

<h2>Usage</h2>
<pre lang="tsx"><code lang="tsx">import { tf } from "tailwind-factory";
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
});</code></pre>

<p>Tailwind Factory also support custom components:</p>
<pre lang="tsx"><code lang="tsx">//Example using a custom JSX component
const JSXTitle = (
  //The component need to have the className property!
  { children, className }: { 
    children: ReactNode, 
    className?: string 
  }
) => &lt;h2 className={className}>
{children}
&lt;/h2>;
//Is recommended create the component outside the function
// to prevent a bug with Tailwind CSS IntelliSense
export const Title = tf(JSXTitle, `
  text-3xl
  text-inherit
`, {})</code></pre>

<p>You can extends styles too:</p>
<pre lang="tsx"><code lang="tsx">//Example extending the styles
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
});</code></pre>

<h2>Snippets</h2>
<p>Tailwind Factory has an official extension that accompanies some snippets. See in: <a href="https://marketplace.visualstudio.com/items?itemName=l-marcel.tailwind-factory" target="__blank__">
Tailwind Factory Extension</a></p>

<div id="grid">
  <div id="grid-item">
    <h2 align="center">Roadmap:</h2>
    <ul>
      <li id="checked"><p>Create a factory component;</p></li>
      <li id="checked"><p>Add a method to extends a factory component;</p></li>
      <li id="checked"><p>Tailwind intellisense support;</p></li>
      <li id="checked"><p>Snippets;</p></li>
      <li id="checked"><p>Improve default variants types' check;</p></li>
      <li id="checked"><p>Add all tests;</p></li>
      <li id="unchecked"><p>Add interpolated variants;</p></li>
      <li id="unchecked"><p>Add 'as' property in factory components;</p></li>
      <li id="unchecked"><p>Separate factory components `extends` function.</p></li>
    </ul>
  </div>
</div>