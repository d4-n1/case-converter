function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // convert camelCase to kebab-case
    .replace(/[\s_]+/g, '-') // convert spaces and underscores to hyphens
    .replace(/([^0-9-])([0-9]+)/g, '$1-$2') // separate numbers from letters
    .replace(/([0-9]+)([^0-9-])/g, '$1-$2') // separate numbers from letters
    .toLowerCase(); // convert all letters to lowercase
}

function toSnakeCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // convert camelCase to snake_case
    .replace(/[\s-]+/g, '_') // convert spaces and hyphens to underscores
    .replace(/([^0-9_])([0-9]+)/g, '$1_$2') // separate numbers from letters
    .replace(/([0-9]+)([^0-9_])/g, '$1_$2') // separate numbers from letters
    .toLowerCase(); // convert all letters to lowercase
}

function toCamelCase(str: string) {
  return str
    .replace(/[\s_-]+(\w)/g, (_match, letter) => letter.toUpperCase()) // convert spaces, underscores, and hyphens to camelCase
    .replace(/^\w/, (letter) => letter.toLowerCase()); // convert the first letter to lowercase
}


// Define the function to apply the font and text changes to a text node
async function applyTextChanges(node: TextNode) {
  // Load all the fonts used in the text content of the node asynchronously
  await Promise.all(
    node.getRangeAllFontNames(0, node.characters.length)
      .map(figma.loadFontAsync)
  );

  // Convert the text content to kebab case
  const kebabCaseText = toKebabCase(node.characters);

  // Update the text content and font of the node
  node.characters = kebabCaseText;
}
async function main() {
  // Get the current selection in Figma
  const selection = figma.currentPage.selection;

  const fontPromises = selection.map(node => {
    if (node.type === 'TEXT') {
      return Promise.all(
        node.getRangeAllFontNames(0, node.characters.length)
          .map(figma.loadFontAsync)
      );
    } else {
      return Promise.resolve();
    }
  });

  // Wait for all the font promises to resolve
  await Promise.all(fontPromises);

  // Loop through each selected item
  for (const node of selection) {
    if (node.type === 'TEXT') {
      // Apply the font and text changes to the node
      await applyTextChanges(node);
    }
  }

  // Notify the user and close the plugin
  figma.notify("All text were changed to kebab-case!")
  figma.closePlugin();
}

// Call the main function to start the plugin
main();
