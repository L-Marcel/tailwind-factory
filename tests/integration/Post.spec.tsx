/* eslint-disable prettier/prettier */
import { tf } from "../../src/index";
import { render, screen } from "@testing-library/react";

describe("[Main] Factory Post", () => {
  it("Should be able to post classes in children", () => {
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
    `
    );

    render(
      <Container data-testid="container">
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
    );

    const container = screen.getByTestId("container");

    expect(container).toContainHTML(
      "<h1 class=\"text-red-400\">Red Title</h1>" + 
      "<h2 class=\"italic text-red-400\">Red</h2>" +
      "<p class=\"text-red-400\">Red Text</p>" + 
      "<div class=\"h-3 flex flex-col bg-blue-200\">" + 
        "<h2 class=\"italic font-bold text-6xl\">Normal</h2>" + 
        "<div class=\"h-3 hover:bg-red-300\">" + 
          "<h2 class=\"italic text-6xl\">Normal</h2>" + 
        "</div>" + 
      "</div>"
    );
  });

  it("Should be able to post classes in children when component was extended", () => {
    const TextContainer = tf(
      "div",
      `
      > h2 {
        text-red-400
      }
    `
    );

    const Header = TextContainer.extends(null, `
      h1 {
        text-9xl
      }
    `);

    render(
      <Header data-testid="header">
        <h1>Title</h1>
        <h2>Subtitle</h2>
      </Header>
    );

    const header = screen.getByTestId("header");

    expect(header).toContainHTML(
      "<h1 class=\"text-9xl\">Title</h1>" +
      "<h2 class=\"text-red-400\">Subtitle</h2>"
    );
  });

  it("Should be able to ignore post classes when not find any children", () => {
    const Container = tf(
      "div",
      `
      > h2 {
        text-red-400
      }

      bg-red-600
    `
    );

    render(
      <Container data-testid="container"/>
    );

    const header = screen.getByTestId("container");

    expect(header.className).toBe("bg-red-600");
  });

  it("Should be able to check variants and post classes in children", () => {
    const TextContainer = tf(
      "div",
      `
      bg-lime-200
      w-4

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
    `, {
      variants: {
        italic: {
          true: `
            h2 {
              italic
            }

            > h2 {
              text-red-400
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
    }
    );

    render(
      <>
        <TextContainer data-testid="container">
          <h2>Red</h2>
          <div>
            <h2>Normal</h2>
            <div className="hover:bg-red-300">
              <h2>Normal</h2>
              <a className="hover:text-red-700" href="#">No Underline</a>
            </div>
          </div>
        </TextContainer>
        <TextContainer italic data-testid="italic-container">
          <h2>Red</h2>
          <div>
            <h2>Normal</h2>
            <div className="hover:bg-red-300">
              <h2>Normal</h2>
              <a className="hover:text-red-700" href="#">No Underline</a>
            </div>
          </div>
        </TextContainer>
      </>
    );

    const container = screen.getByTestId("container");

    expect(container).toContainHTML(
      "<h2 class=\"underline\">Red</h2>" +
      "<div class=\"h-3 flex flex-col bg-blue-200\">" + 
        "<h2 class=\"font-bold text-6xl underline\">Normal</h2>" + 
        "<div class=\"h-3 hover:bg-red-300\">" + 
          "<h2 class=\"text-6xl underline\">Normal</h2>" + 
          "<a class=\"hover:text-red-700\" href=\"#\">No Underline</a>" +
        "</div>" + 
      "</div>"
    );

    const italicContainer = screen.getByTestId("italic-container");

    expect(italicContainer).toContainHTML(
      "<h2 class=\"italic text-red-400\">Red</h2>" +
      "<div class=\"h-3 flex flex-col bg-blue-200\">" + 
        "<h2 class=\"font-bold text-6xl italic\">Normal</h2>" + 
        "<div class=\"h-3 hover:bg-red-300\">" + 
          "<h2 class=\"text-6xl italic\">Normal</h2>" + 
          "<a class=\"no-underline hover:text-red-700\" href=\"#\">No Underline</a>" +
        "</div>" + 
      "</div>"
    );
  });

  it("Should be able to post classes in children by another classes", () => {
    const TextContainer = tf(
      "div",
      `
      > .title {
        text-red-400
      }
    `
    );

    const Header = TextContainer.extends(null, `
      h1 {
        text-9xl
      }
    `);

    render(
      <Header data-testid="header">
        <h1 className="title">Title</h1>
      </Header>
    );

    const header = screen.getByTestId("header");

    expect(header).toContainHTML(
      "<h1 class=\"title text-red-400 text-9xl\">Title</h1>"
    );
  });

  it("Should be able to post classes in children by id", () => {
    const TextContainer = tf(
      "div",
      `
      > #title {
        text-red-400
      }
    `
    );

    const Header = TextContainer.extends(null, `
      h1 {
        text-9xl
      }
    `);

    render(
      <Header data-testid="header">
        <h1 id="title">Title</h1>
      </Header>
    );

    const header = screen.getByTestId("header");

    expect(header).toContainHTML(
      "<h1 id=\"title\" class=\"text-red-400 text-9xl\">Title</h1>"
    );
  });
});
