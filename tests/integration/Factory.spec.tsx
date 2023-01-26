import { render, screen } from "@testing-library/react";
import { tf } from "../../src";

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
    expect(title).toHaveClass("text-blue-500 text-sm", { exact: true });
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
    expect(container).toHaveClass("flex relative", { exact: true });

    const fixedContainer = screen.getByTestId("fixed-container");

    expect(fixedContainer.tagName).toBe("DIV");
    expect(fixedContainer).toContainHTML("<p>Example</p>");
    expect(fixedContainer).toHaveClass("flex absolute", { exact: true });
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
    expect(container).toHaveClass("flex relative bg-red-500 w-5", { exact: true });

    const fixedContainer = screen.getByTestId("fixed-container");

    expect(fixedContainer.tagName).toBe("DIV");
    expect(fixedContainer).toContainHTML("<p>Example</p>");
    expect(fixedContainer).toHaveClass("flex absolute bg-blue-500 w-3", { exact: true });
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
    expect(description).toHaveClass("text-blue-500 text-sm first-line:text-green-200", {
      exact: true,
    });
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
        <Hero data-testid="hero">
          <p>Example</p>
        </Hero>
        <Hero fixed={false} data-testid="fixed-hero">
          <p>Example</p>
        </Hero>
        <Hero fixed="sticky" data-testid="sticky-hero">
          <p>Example</p>
        </Hero>
      </>
    );

    const hero = screen.getByTestId("hero");

    expect(hero.tagName).toBe("DIV");
    expect(hero).toContainHTML("<p>Example</p>");
    expect(hero).toHaveClass("flex mt-5 absolute top-3", { exact: true });

    const fixedHero = screen.getByTestId("fixed-hero");

    expect(fixedHero.tagName).toBe("DIV");
    expect(fixedHero).toContainHTML("<p>Example</p>");
    expect(fixedHero).toHaveClass("flex relative mt-5", { exact: true });

    const stickyHero = screen.getByTestId("sticky-hero");

    expect(stickyHero.tagName).toBe("DIV");
    expect(stickyHero).toContainHTML("<p>Example</p>");
    expect(stickyHero).toHaveClass("flex mt-5 sticky", { exact: true });
  });
});
