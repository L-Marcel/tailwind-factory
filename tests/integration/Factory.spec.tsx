import { render, screen } from "@testing-library/react";
import { tf } from "../../src";
import { DetailedHTMLProps, HTMLAttributes } from "react";

describe("[Main] Tailwind Factory", () => {
  it("Should be able to create a simple factory component", () => {
    const Text = tf(
      "p",
      `
      text-blue-500
      text-sm
    `,
      {
        variants: {},
        defaultVariants: {},
      }
    );

    render(<Text data-testid="title">Example</Text>);

    const title = screen.getByTestId("title");

    expect(title.tagName).toBe("P");
    expect(title).toHaveTextContent("Example");
    expect(title.className).toBe("text-blue-500 text-sm");
  });

  it("Should be able to create a factory component with variants", () => {
    const Container = tf(
      "div",
      `
      flex
    `,
      {
        variants: {
          fixed: {
            true: `
              absolute
            `,
            false: `
              relative
            `,
          },
        },
        defaultVariants: {
          fixed: false,
        },
      }
    );

    render(
      <>
        <Container data-testid="container">
          <p>Example</p>
        </Container>
        <Container fixed data-testid="fixed-container">
          <p>Example</p>
        </Container>
      </>
    );

    const container = screen.getByTestId("container");

    expect(container.tagName).toBe("DIV");
    expect(container).toContainHTML("<p>Example</p>");
    expect(container.className).toBe("flex relative");

    const fixedContainer = screen.getByTestId("fixed-container");

    expect(fixedContainer.tagName).toBe("DIV");
    expect(fixedContainer).toContainHTML("<p>Example</p>");
    expect(fixedContainer.className).toBe("flex absolute");
  });

  it("Should be able to create a factory component with many variants", () => {
    const Container = tf(
      "div",
      `
      flex
    `,
      {
        variants: {
          fixed: {
            true: `
              absolute
            `,
            false: `
              relative
            `,
          },
          background: {
            red: `
              bg-red-500
            `,
            blue: `
              bg-blue-500
            `,
          },
          size: {
            lg: `
              w-8
            `,
            md: `
              w-5
            `,
            sm: `
              w-3
            `,
          },
        },
        defaultVariants: {
          fixed: false,
          size: "lg",
        },
      }
    );

    render(
      <>
        <Container size="md" background="red" data-testid="container">
          <p>Example</p>
        </Container>
        <Container size="sm" background="blue" fixed data-testid="fixed-container">
          <p>Example</p>
        </Container>
      </>
    );

    const container = screen.getByTestId("container");

    expect(container.tagName).toBe("DIV");
    expect(container).toContainHTML("<p>Example</p>");
    expect(container.className).toBe("flex relative bg-red-500 w-5");

    const fixedContainer = screen.getByTestId("fixed-container");

    expect(fixedContainer.tagName).toBe("DIV");
    expect(fixedContainer).toContainHTML("<p>Example</p>");
    expect(fixedContainer.className).toBe("flex absolute bg-blue-500 w-3");
  });

  it("Should be able to set extends function", () => {
    const Container = tf("div", "", {
      variants: {},
      defaultVariants: {},
    });

    expect(Container).toHaveProperty("extends");
  });

  it("Should be able to extends a simple factory component", () => {
    const Text = tf(
      "p",
      `
      text-blue-500
      text-sm
    `,
      {
        variants: {},
        defaultVariants: {},
      }
    );

    const Description = Text.extends(`
      first-line:text-green-200
    `);

    render(<Description data-testid="description">Example</Description>);

    const description = screen.getByTestId("description");

    expect(description.tagName).toBe("P");
    expect(description).toHaveTextContent("Example");
    expect(description.className).toBe("text-blue-500 text-sm first-line:text-green-200");
  });

  it("Should be able to extends a factory component with variants respecting the classes priority", () => {
    const Container = tf(
      "div",
      `
      flex
    `,
      {
        variants: {
          fixed: {
            true: `
              absolute
            `,
            false: `
              relative
            `,
          },
        },
        defaultVariants: {
          fixed: false,
        },
      }
    );

    const Hero = Container.extends(
      `
      mt-5
    `,
      {
        variants: {
          fixed: {
            true: `
              absolute 
              top-3
            `,
            sticky: `
              sticky
            `,
          },
        },
        defaultVariants: {
          fixed: true,
        },
      }
    );

    render(
      <>
        <Hero data-testid="fixed-hero">
          <p>Example</p>
        </Hero>
        <Hero fixed={false} data-testid="hero">
          <p>Example</p>
        </Hero>
        <Hero fixed="sticky" data-testid="sticky-hero">
          <p>Example</p>
        </Hero>
      </>
    );

    const fixedHero = screen.getByTestId("fixed-hero");

    expect(fixedHero.tagName).toBe("DIV");
    expect(fixedHero).toContainHTML("<p>Example</p>");
    expect(fixedHero.className).toBe("flex mt-5 absolute top-3");

    const hero = screen.getByTestId("hero");

    expect(hero.tagName).toBe("DIV");
    expect(hero).toContainHTML("<p>Example</p>");
    expect(hero.className).toBe("flex mt-5 relative");

    const stickyHero = screen.getByTestId("sticky-hero");

    expect(stickyHero.tagName).toBe("DIV");
    expect(stickyHero).toContainHTML("<p>Example</p>");
    expect(stickyHero.className).toBe("flex mt-5 sticky");
  });

  it("Should be able to create a factory component from another component", () => {
    const UnstyledHeader = ({
      navigation,
      ...props
    }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
      navigation: string[];
    }) => {
      return (
        <header {...props}>
          <nav>
            <ul>
              {navigation.map((item) => {
                return <li key={item}>{item}</li>;
              })}
            </ul>
          </nav>
        </header>
      );
    };

    const Header = tf(
      UnstyledHeader,
      `
      mx-3
      my-2
    `,
      {
        variants: {
          theme: {
            dark: `
            bg-zinc-800
          `,
            light: `
            bg-zinc-200
          `,
          },
        },
      }
    );

    render(<Header data-testid="header" navigation={["Home", "Profile"]} theme="dark" />);

    const header = screen.getByTestId("header");

    expect(header.tagName).toBe("HEADER");
    expect(header).toContainHTML("<nav><ul><li>Home</li><li>Profile</li></ul></nav>");
    expect(header.className).toBe("mx-3 my-2 bg-zinc-800");
  });
});
