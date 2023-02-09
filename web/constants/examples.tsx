export const examples = [
  <>
    <span id="comment">//simple</span>{"\n"}
    font-inter{"\n"}
    font-semibold{"\n"}
    text-red-400{"\n"}
    <span>p</span><span id="bracket">{" {"}</span>
      {"\n\t"}font-bold
      {"\n\t"}<span>span</span><span id="bracket">{" {"}</span>
      {"\n\t\t"}text-red-500
      <span id="bracket">{"\n\t}"}</span>
    <span id="bracket">{"\n}"}</span>
  </>,
  <>
    <span id="comment">//medium</span>{"\n"}
    mt-[<span id="bracket">calc(10rem+5%)</span>]{"\n"}
    ml-[<span id="bracket">20%</span>]{"\n"}
    rounded-md{"\n"}
    {'\>'} <span>p</span><span id="bracket">{" {"}</span>
      {"\n\t"}font-bold
      {"\n\t"}<span id="bracket">.example</span><span id="bracket">{" {"}</span>
      {"\n\t\t"}md:text-red-500
      <span id="bracket">{"\n\t}"}</span>
    <span id="bracket">{"\n}"}</span>
  </>,
  <>
    <span id="comment">//advanced</span>{"\n"}
    :has(<span>button</span>) <span id="bracket">{" {"}</span>
    {"\n\t"}<span id="pseudo">md:after:</span>w-6
    {"\n\t"}<span id="pseudo">md:after:</span>h-6
    {"\n\t> "}<span>p, a, h1, h2</span><span id="bracket">{" {"}</span>
      {"\n\t\t"}font-bold
      {"\n\t\t"}<span id="pseudo">md:</span>font-semibold
      {"\n\t\t"}<span id="pseudo">2xl:</span>text-custom-800
      <span id="bracket">{"\n\t}"}</span>
    <span id="bracket">{"\n}"}</span>
  </>
];