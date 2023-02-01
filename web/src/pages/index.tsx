import tf from "tailwind-factory/macro";
export default function Home() {
  //I'm studying...
  //This is my first macro!!!
  tf(
    "div",
    `
    text-red-500
    text-red-200
  `,
    {}
  );
  //Yes, it is to throw an error.

  return <div></div>;
}
