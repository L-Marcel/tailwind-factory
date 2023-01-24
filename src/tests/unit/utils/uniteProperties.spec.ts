import { uniteProperties } from "../../../utils/uniteProperties";

describe("[Utils] UniteProperties", () => {
  it("Should be able to unite properties when all objects are void", () => {
    const oldObject = {};
    const newObject = {};

    const unitedObject = uniteProperties(oldObject, newObject);
    expect(unitedObject).toEqual({});
  });

  it("Should be able to unite properties when the objects have different properties", () => {
    const oldObject = {
      first: "example",
    };
    const newObject = {
      second: "example",
    };

    const unitedObject = uniteProperties(oldObject, newObject);
    expect(unitedObject).toEqual({
      first: "example",
      second: "example",
    });
  });

  it("Should be able to replace properties when their keys are equals", () => {
    const oldObject = {
      first: {
        message: {},
      },
      second: "another example",
    };
    const newObject = {
      first: "new example",
    };

    const unitedObject = uniteProperties(oldObject, newObject);
    expect(unitedObject).toEqual({
      first: "new example",
      second: "another example",
    });
  });

  it("Should be able to unite properties when they are objects with the same properties", () => {
    const oldObject = {
      first: {
        message: "old example",
      },
      second: "example",
    };
    const newObject = {
      first: {
        message: "new example",
      },
    };

    const unitedObject = uniteProperties(oldObject, newObject);
    expect(unitedObject).toEqual({
      first: {
        message: "new example",
      },
      second: "example",
    });
  });

  it("Should be able to unite properties when they are objects with different properties", () => {
    const oldObject = {
      first: {
        message: "old example",
        image: "code",
        ref: "current",
      },
      second: "example",
    };
    const newObject = {
      first: {
        message: "new example",
        image: "tag",
        tag: true,
        database: "root",
      },
    };

    const unitedObject = uniteProperties(oldObject, newObject);
    expect(unitedObject).toEqual({
      first: {
        message: "new example",
        image: "tag",
        tag: true,
        database: "root",
        ref: "current",
      },
      second: "example",
    });
  });

  it("Should be able to unite deep properties", () => {
    const currentDate = new Date();
    const oldObject = {
      first: {
        message: "old example",
        image: {
          href: "http://localhost:3333/image.png",
          background: "red",
          opacity: 0.1,
        },
      },
      second: "example",
    };
    const newObject = {
      first: {
        message: "new example",
        date: currentDate,
        image: {
          href: "http://localhost:3333/new-image.png",
          opacity: 1,
          focused: true,
        },
      },
      second: {
        message: "old example",
        image: {
          href: "http://localhost:3333/image.png",
          background: "red",
          opacity: 0.1,
        },
      },
    };

    const unitedObject = uniteProperties(oldObject, newObject);
    expect(unitedObject).toEqual({
      first: {
        message: "new example",
        date: currentDate,
        image: {
          href: "http://localhost:3333/new-image.png",
          background: "red",
          opacity: 1,
          focused: true,
        },
      },
      second: {
        message: "old example",
        image: {
          href: "http://localhost:3333/image.png",
          background: "red",
          opacity: 0.1,
        },
      },
    });
  });
});
