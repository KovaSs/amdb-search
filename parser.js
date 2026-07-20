import { promises as fs, createReadStream } from "fs";
import path from "path";
import crypto from "crypto";

// ----------------------------------------------------------------------
// Фиксированные настройки (без параметров командной строки)
// ----------------------------------------------------------------------

// Игнорируемые директории (на любом уровне)
const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".vscode",
  ".idea",
  "dist",
  "build",
  "coverage",
  ".next",
  "out",
  "vendor",
  "tmp",
  "temp",
  "logs",
  ".gitlab",
  ".helm",
  ".husky",
  ".nx",
]);

// Игнорируемые файлы по имени (на любом уровне)
const IGNORE_FILES = new Set([
  "result.md",
  ".DS_Store",
  "thumbs.db",
  ".env",
  ".gitignore",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "composer.lock",
  "game.db",
]);

// Максимальный размер бинарного файла для включения base64 (1 МБ)
const MAX_BINARY_SIZE = 1 * 1024 * 1024;

// ----------------------------------------------------------------------
// Определение типов файлов и языков (с группировкой для читаемости)
// ----------------------------------------------------------------------

const TEXT_EXTENSIONS = new Set([
  // -------------------------------
  // Web
  // -------------------------------
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".vue",
  ".svelte",

  // -------------------------------
  // Backend
  // -------------------------------
  ".py",
  ".rb",
  ".php",
  ".java",
  ".go",
  ".rs",
  ".swift",
  ".kt",
  ".scala",

  // -------------------------------
  // Config / data
  // -------------------------------
  ".json",
  ".yaml",
  ".yml",
  ".toml",
  ".ini",
  ".cfg",
  ".conf",
  ".xml",
  ".svg",
  ".properties",
  ".env.example",

  // -------------------------------
  // Documentation
  // -------------------------------
  ".md",
  ".rst",
  ".txt",
  ".tex",
  ".log",
  ".csv",
  ".tsv",
  ".psv",

  // -------------------------------
  // Shell / scripts
  // -------------------------------
  ".sh",
  ".bash",
  ".zsh",
  ".fish",
  ".ps1",
  ".bat",
  ".cmd",

  // -------------------------------
  // Database
  // -------------------------------
  ".sql",
  ".graphql",
  ".gql",

  // -------------------------------
  // Other code
  // -------------------------------
  ".cpp",
  ".c",
  ".h",
  ".hpp",
  ".cs",
  ".fs",
  ".fsx",
  ".lua",
  ".pl",
  ".pm",

  // -------------------------------
  // Templates
  // -------------------------------
  ".ejs",
  ".pug",
  ".jade",
  ".handlebars",
  ".hbs",
  ".mustache",
]);

const EXTENSION_TO_LANG = {
  // Web
  ".js": "javascript",
  ".jsx": "jsx",
  ".ts": "typescript",
  ".tsx": "tsx",
  ".vue": "vue",
  ".svelte": "svelte",
  ".html": "html",
  ".htm": "html",
  ".css": "css",
  ".scss": "scss",
  ".sass": "sass",
  ".less": "less",

  // Backend
  ".py": "python",
  ".rb": "ruby",
  ".php": "php",
  ".java": "java",
  ".go": "go",
  ".rs": "rust",
  ".swift": "swift",
  ".kt": "kotlin",
  ".scala": "scala",

  // Config / data
  ".json": "json",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".toml": "toml",
  ".xml": "xml",
  ".svg": "svg",
  ".properties": "properties",
  ".ini": "ini",
  ".cfg": "ini",
  ".conf": "ini",

  // Documentation
  ".md": "markdown",
  ".rst": "rst",
  ".txt": "text",
  ".log": "text",
  ".csv": "csv",
  ".tsv": "tsv",

  // Shell / scripts
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "bash",
  ".ps1": "powershell",
  ".bat": "batch",
  ".cmd": "batch",

  // Database
  ".sql": "sql",
  ".graphql": "graphql",
  ".gql": "graphql",

  // Other code
  ".cpp": "cpp",
  ".c": "c",
  ".h": "c",
  ".hpp": "cpp",
  ".cs": "csharp",
  ".lua": "lua",
  ".pl": "perl",
  ".pm": "perl",

  // Templates
  ".ejs": "ejs",
};

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return TEXT_EXTENSIONS.has(ext);
}

function getLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return EXTENSION_TO_LANG[ext] || "";
}

// ----------------------------------------------------------------------
// Обход директорий – собираем ВСЕ неигнорируемые пути (и папки, и файлы)
// ----------------------------------------------------------------------

async function walk(dir, baseDir = dir, results = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (IGNORE_FILES.has(entry.name)) continue;

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      // добавляем папку в результаты (даже если она пуста)
      results.push({ path: fullPath, isDirectory: true });
      await walk(fullPath, baseDir, results);
    } else {
      results.push({ path: fullPath, isDirectory: false });
    }
  }
  return results;
}

// ----------------------------------------------------------------------
// Чтение файла с обработкой
// ----------------------------------------------------------------------

async function readFileContent(filePath) {
  const stats = await fs.stat(filePath);
  const isText = isTextFile(filePath);

  if (isText) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      return { type: "text", content, stats };
    } catch (err) {
      console.warn(
        `Не удалось прочитать текстовый файл ${filePath}: ${err.message}`,
      );
      return null;
    }
  }

  // Бинарный файл
  if (stats.size > MAX_BINARY_SIZE) {
    // слишком большой – только метаданные
    const hash = crypto
      .createHash("md5")
      .update(await fs.readFile(filePath))
      .digest("hex");
    return { type: "binary-meta", stats, hash };
  } else {
    const buffer = await fs.readFile(filePath);
    const base64 = buffer.toString("base64");
    const hash = crypto.createHash("md5").update(buffer).digest("hex");
    return { type: "binary", content: base64, stats, hash };
  }
}

// ----------------------------------------------------------------------
// Генерация дерева каталогов
// ----------------------------------------------------------------------

function generateTree(entries, baseDir) {
  const root = { name: path.basename(baseDir), children: {}, files: [] };

  for (const entry of entries) {
    const relative = path.relative(baseDir, entry.path);
    const parts = relative.split(path.sep);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (!isLast) {
        if (!current.children[part]) {
          current.children[part] = { name: part, children: {}, files: [] };
        }
        current = current.children[part];
      } else {
        if (entry.isDirectory) {
          if (!current.children[part]) {
            current.children[part] = { name: part, children: {}, files: [] };
          }
        } else {
          current.files.push(part);
        }
      }
    }
  }

  // рекурсивная отрисовка
  function render(node, prefix = "") {
    const lines = [];
    const dirs = Object.keys(node.children).sort();
    const files = node.files.sort();

    for (let i = 0; i < dirs.length; i++) {
      const dirName = dirs[i];
      const child = node.children[dirName];
      const isLastDir = i === dirs.length - 1 && files.length === 0;
      lines.push(prefix + (isLastDir ? "└── " : "├── ") + dirName + "/");
      lines.push(
        ...render(child, prefix + (isLastDir ? "    " : "│   "), isLastDir),
      );
    }

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const isLastFile = i === files.length - 1;
      lines.push(prefix + (isLastFile ? "└── " : "├── ") + fileName);
    }
    return lines;
  }

  return render(root).join("\n");
}

// ----------------------------------------------------------------------
// Основная функция
// ----------------------------------------------------------------------

async function main() {
  const startDir = process.cwd();
  console.log(`Сканирование директории: ${startDir}`);

  const entries = await walk(startDir);
  entries.sort((a, b) => a.path.localeCompare(b.path));

  const filePaths = entries.filter((e) => !e.isDirectory).map((e) => e.path);
  console.log(
    `Найдено элементов: всего ${entries.length}, файлов: ${filePaths.length}`,
  );

  const tree = generateTree(entries, startDir);

  const fileBlocks = [];
  const tocItems = [];

  let totalFiles = filePaths.length;
  let parsedFiles = 0;
  let skippedBinaryLarge = 0;
  let failedFiles = 0;

  for (const filePath of filePaths) {
    const relativePath = path.relative(startDir, filePath);

    let fileData;
    try {
      fileData = await readFileContent(filePath);
    } catch (err) {
      console.warn(`Ошибка обработки ${filePath}: ${err.message}`);
      failedFiles++;
      continue;
    }

    if (!fileData) {
      failedFiles++;
      continue;
    }

    if (fileData.type === "text" || fileData.type === "binary") {
      parsedFiles++;
    } else if (fileData.type === "binary-meta") {
      skippedBinaryLarge++;
    }

    const anchor = relativePath
      .replace(/[^a-zA-Z0-9\-_/]/g, "_")
      .replace(/\//g, "-");
    tocItems.push(`- [${relativePath}](#${anchor})`);

    let block = `// ${relativePath}`;

    if (fileData.type === "text") {
      const lang = getLanguage(filePath);
      block += `\n\n\`\`\`${lang}\n${fileData.content}\n\`\`\``;
    } else if (fileData.type === "binary") {
      block += ` (base64, size: ${fileData.stats.size}, mtime: ${fileData.stats.mtime.toISOString()}, md5: ${fileData.hash})\n\n\`\`\`\n${fileData.content}\n\`\`\``;
    } else {
      block += ` (meta only, size: ${fileData.stats.size}, mtime: ${fileData.stats.mtime.toISOString()}, md5: ${fileData.hash})\n\n\`\`\`\`\`\``;
    }

    fileBlocks.push(block + "\n\n");
  }

  const header = `# Анализ структуры проекта

**Дата генерации:** ${new Date().toLocaleString()}
**Обработано файлов:** ${totalFiles}
**Всего элементов (с учётом папок):** ${entries.length}

## Структура проекта

\`\`\`
${tree}
\`\`\`

## Оглавление

${tocItems.join("\n")}

## Содержимое файлов

`;

  const outputContent = header + fileBlocks.join("");
  const outputFilePath = path.join(startDir, "result.md");
  await fs.writeFile(outputFilePath, outputContent, "utf8");

  console.log(`\nСтатистика:
  Всего файлов: ${totalFiles}
  Успешно распарсено (текст + base64): ${parsedFiles}
  Бинарных >1 МБ (только метаданные): ${skippedBinaryLarge}
  Ошибок чтения: ${failedFiles}
Готово! Результат сохранён в ${outputFilePath}`);
}

main().catch((err) => {
  console.error("Ошибка:", err);
  process.exit(1);
});
