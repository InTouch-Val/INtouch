//@ts-nocheck

export default function decodeStyledText(jsonData) {
  const data = JSON.parse(jsonData);
  let html = "";
  let isList = false;
  let listType = "";

  const applyStyles = (char, styles) => {
    if (styles.includes("BOLD")) {
      char = `<b>${char}</b>`;
    }
    if (styles.includes("ITALIC")) {
      char = `<em>${char}</em>`;
    }
    if (styles.includes("UNDERLINE")) {
      char = `<u>${char}</u>`;
    }
    return char;
  };

  for (const blockKey in data.blockMap) {
    const block = data.blockMap[blockKey];
    const blockType = block.type;

    // Определение типа списка
    let currentListType = "";
    if (blockType === "unordered-list-item") {
      currentListType = "ul";
    } else if (blockType === "ordered-list-item") {
      currentListType = "ol";
    }

    // Если текущий блок является началом нового списка
    if (currentListType && (!isList || listType !== currentListType)) {
      // Закрываем предыдущий список, если он открыт
      if (isList) {
        html += "</li></" + listType + ">";
      }
      // Начинаем новый список
      isList = true;
      listType = currentListType;
      html += `<${listType}>`;
    } else if (!currentListType && isList) {
      // Если текущий блок не является частью списка, но список открыт
      html += "</li></" + listType + ">";
      isList = false;
    }

    let openTag = "";
    let closeTag = "";
    switch (blockType) {
      case "unstyled":
        openTag = "<p>";
        closeTag = "</p>";
        break;
      case "header-one":
        openTag = "<h1>";
        closeTag = "</h1>";
        break;
      case "header-two":
        openTag = "<h2>";
        closeTag = "</h2>";
        break;
      case "header-three":
        openTag = "<h3>";
        closeTag = "</h3>";
        break;
      case "unordered-list-item":
      case "ordered-list-item":
        openTag = "<li>";
        closeTag = "</li>";
        break;
      default:
        break;
    }

    html += openTag;

    for (let index = 0; index < block.text.length; index++) {
      let char = block.text[index];
      const { style } = block.characterList[index];
      char = applyStyles(char, style);
      html += char;
    }

    html += closeTag;
  }

  // Закрываем список, если он открыт
  if (isList) {
    html += "</li></" + listType + ">";
  }

  return html;
}
