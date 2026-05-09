# 🎴 Anki Universal Extractor

> **High-performance Anki (.apkg) deck extractor.** Liberate your flashcards from Anki's database into clean, actionable JSON and media assets.

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Anki Universal Extractor is a robust, script-based solution built with **Bun** and **TypeScript** to process `.apkg` files. It automates the extraction of notes (converted to JSON) and associated media files (audio/images) from any Anki deck, bypassing database locking issues and template complexities.

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [❓ Why Anki Universal Extractor?](#-why-anki-universal-extractor)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Usage](#-usage)
- [📂 Project Structure](#-project-structure)
- [📝 Data Format](#-data-format)
- [🤝 Contributing](#-contributing)

---

## ✨ Key Features

- **⚡ Blazing Fast**: Leverages Bun's native SQLite module for near-instant extraction.
- **🔄 Universal Field Mapping**: Automatically detects and maps dynamic field names from any Anki template (No hardcoded field names).
- **📦 Media Integrity**: Extracts and organizes images, audio, and videos with their original filenames.
- **🛡️ Windows Friendly**: Handles database locking gracefully to prevent extraction errors on Windows systems.
- **📄 Clean JSON Output**: Generates a standard JSON structure ready for web apps, print tools, or AI processing.

## ❓ Why Anki Universal Extractor?

Extracting data from Anki can be "deceptively simple" until you encounter:
1. **Database Locks**: Accessing `collection.anki2` while Anki is open or through standard tools often fails.
2. **Complex Schemas**: Different decks use different field names (e.g., "Hanzi" vs "Front"). This tool maps them dynamically based on the deck's metadata.
3. **Media Mapping**: Anki stores media filenames numerically in a JSON map; this tool restores their human-readable names automatically.

## 🚀 Quick Start

### Prerequisites
- [Bun Runtime](https://bun.sh/) (Required for SQLite performance and TS execution)

### Installation
```bash
# Clone the repository
git clone https://github.com/srsergi0/anki-universal-extractor.git

# Enter the directory
cd anki-universal-extractor

# Install dependencies
bun install
```

## 🛠️ Usage

You can run the extractor directly without installing it using `bun x`, or run it locally after installation.

### ⚡ Option 1: Run with `bun x` (Easiest)
Convert any `.apkg` file to JSON and a media folder instantly:

```bash
bun x github:srsergi0/anki-universal-extractor ./path/to/your/deck.apkg
```

### 💻 Option 2: Local Execution
If you have cloned the repo and run `bun install`:

```bash
bun run anki-extract.ts ./path/to/your/deck.apkg
```

### Output Result:
- `deck.json`: A complete database of your cards.
- `deck_media/`: A folder containing all associated media files.

## 📂 Project Structure

- `anki-extract.ts`: The main extraction engine.
- `data/`: (Recommended) Place your source `.apkg` files here.
- `package.json`: Configuration and dependencies.

## 📝 Data Format

The output JSON provides a flat, developer-friendly structure:

```json
[
  {
    "Front": "Question or Term",
    "Back": "Answer or Definition",
    "Notes": "Extra information",
    "_tags": ["Tag1", "Tag2"],
    "_modelId": 123456789
  }
]
```

## 🤝 Contributing

Contributions are welcome! Whether it's fixing bugs, adding features, or improving documentation, feel free to open a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
