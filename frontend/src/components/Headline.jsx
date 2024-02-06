function Headline({ block, updateBlock }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Headline"
        value={block.headline}
        onChange={(e) => updateBlock(block.id, null, null, e.target.value)}
      />
      <textarea
        placeholder="Enter text..."
        value={block.text}
        onChange={(e) => updateBlock(block.id, null, null, null, e.target.value)}
      />
    </div>
  );
}

export { Headline };
