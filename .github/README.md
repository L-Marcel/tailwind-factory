<div valing="top">
  <h1>Tailwind <span>Factory</span></h1>
  <p>Uma biblioteca para criar e estender componentes do React definindo variantes como o Stitches usando o Tailwind!</p>
  <nav>
    <div id="repository-buttons"/>
    <a class="navigation-link disabled" href="https://github.com/L-Marcel/l-marcel/blob/main/README.en-US.md" target="__blank__">
      en-us
    </a>
    <span class="disabled">•</span>
    <a class="navigation-link" href="https://www.npmjs.com/package/tailwind-factory" target="__blank__">
      npm
    </a>
  </nav>
</div>

<br/>

<p>Primeiro você precisa instalar e configurar o <a href="https://tailwindcss.com/docs/installation/" target="__blank__">
Tailwind</a>!</p>

<p>Para instalar o Tailwind Factory você precisa rodar em seu projeto:</p>

<pre><code>
//Usando pnpm
pnpm add tailwind-factory

//Usando npm
npm install tailwind-factory

//Usando yarn
yarn add tailwind-factory
</code></pre>

<p>Agora, você precisa instalar o <a href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss/" target="__blank__">
Tailwind CSS IntelliSense</a> e adicionar as configurações abaixo:</p>

<pre lang="tsx"><code lang="tsx">//Tailwind IntelliSense Regex
"tailwindCSS.experimental.classRegex": [
  ["tf\\(([^)]*)\\)", "(?:`)([^'\"`]*)(?:`)"], // tf(`...`)
  ["\\.extends\\(([^)]*)\\)", "(?:`)([^'\"`]*)(?:`)"], // xxx.extends(`...`)
],</code></pre>

<h2>Uso</h2>
<pre lang="tsx"><code lang="tsx">import { tf } from "tailwind-factory";
//Exemplo de um caso de uso comum
//Nota: use ` para usar o Tailwind CSS IntelliSense
// e " or ' para usar o autocomplete das propriedades
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

<p>Tailwind Factory também suporta components customizados:</p>
<pre lang="tsx"><code lang="tsx">//Exemplo usando um componente JSX
const JSXTitle = (
  //The component need to have the className property!
  { children, className }: { 
    children: ReactNode, 
    className?: string 
  }
) => &lt;h2 className={className}>
{children}
&lt;/h2>;
//É recomendado criar o elemento fora da função
// para previnir um bug com o Tailwind CSS IntelliSense
export const Title = tf(JSXTitle, `
  text-3xl
  text-inherit
`, {})</code></pre>

<p>Você também pode estender os estilos:</p>
<pre lang="tsx"><code lang="tsx">//Exemplo estendendo os estilos
//Nota: todos os componentes estilizados possuem uma função `extends`
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
});</code></pre>

<div id="grid">
  <div id="grid-item">
    <h2 align="center">Roadmap:</h2>
    <ul>
      <li id="checked"><p>Criar um componente estilizado;</p></li>
      <li id="checked"><p>Adicionar um método para estender um componente estilizado;</p></li>
      <li id="checked"><p>Suporte para o Tailwind intellisense;</p></li>
      <li id="unchecked"><p>Snippets;</p></li>
      <li id="unchecked"><p>Melhorar a checagem da tipagem das variantes padrões;</p></li>
      <li id="unchecked"><p>Adicionar todos os testes;</p></li>
      <li id="unchecked"><p>Adicionar uma propriedade para interpolar variantes.</p></li>
    </ul>
  </div>
</div>