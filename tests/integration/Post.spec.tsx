/* eslint-disable prettier/prettier */
import { tf } from "../../src/index";
import { render, screen } from "@testing-library/react";

describe("[Main] Factory Post", () => {
  it("Should be able to post classes in children", () => {
    const TextContainer = tf(
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

      > h2 {
        text-red-400
      }
    `
    );

    render(
      <>
        <TextContainer data-testid="container">
          <h2>Red</h2>
          <div>
            <h2>Normal</h2>
            <div className="hover:bg-red-300">
              <h2>Normal</h2>
            </div>
          </div>
        </TextContainer>
      </>
    );

    const container = screen.getByTestId("container");

    expect(container).toContainHTML(
      "<h2 class=\"italic text-red-400\">Red</h2>" +
      "<div class=\"h-3 flex flex-col bg-blue-200\">" + 
        "<h2 class=\"italic font-bold text-6xl\">Normal</h2>" + 
        "<div class=\"h-3 hover:bg-red-300\">" + 
          "<h2 class=\"italic text-6xl\">Normal</h2>" + 
        "</div>" + 
      "</div>"
    );
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
});
