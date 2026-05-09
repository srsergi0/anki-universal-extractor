# 🎴 Anki Universal Extractor

> A high-performance, universal utility to liberate your flashcards from Anki's database into clean, actionable JSON and media assets.

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

## ✨ Overview

This tool is designed to bypass the complexity of Anki's internal database structure. It provides a robust, script-based solution to process `.apkg` files, extracting all notes and their associated media files (audio, images) automatically.

Built specifically to handle the "deceptively simple" task of data extraction, it ensures:
- **Zero Database Locking**: Safely handles file extraction on Windows systems.
- **Universal Field Mapping**: Automatically detects and maps dynamic field names from any Anki template.
- **Media Integrity**: Preserves and organizes all media files with their original filenames.

## 🚀 Getting Started

### Prerequisites

You must have [Bun](https://bun.sh/) installed.

### Installation

Clone the repository and install dependencies:

```bash
bun install
```

## 🛠️ Usage

To extract an Anki deck, simply run the extractor script pointing to your `.apkg` file:

```bash
bun run anki-extract.ts ./data/your-deck.apkg
```

### What happens next?
1. **Extraction**: The script unzips the `.apkg` and accesses the SQLite collection.
2. **JSON Output**: A `.json` file is generated in the same directory containing all notes with their field names and tags.
3. **Media Assets**: A folder named `*_media` is created containing all images and audio files used in the deck.

## 📂 Project Structure

- `anki-extract.ts`: The core extraction engine using `bun:sqlite`.
- `data/`: Recommended directory for your `.apkg` files and extracted output.
- `package.json`: Project configuration and dependencies (AdmZip for package handling).

## 📝 Output Format

The generated JSON follows a flat, easy-to-parse structure:

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

## ⚖️ License

MIT
