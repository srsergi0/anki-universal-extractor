#!/usr/bin/env bun
import { Database } from "bun:sqlite";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";

async function extractAnki(apkgPath: string) {
  console.log(`\x1b[36m[AnkiExtractor]\x1b[0m Processing: ${apkgPath}`);

  if (!fs.existsSync(apkgPath)) {
    console.error(`\x1b[31mError:\x1b[0m File not found: ${apkgPath}`);
    process.exit(1);
  }

  // 1. Setup temporary directory
  const tempDir = path.join(tmpdir(), `anki-extract-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    // 2. Unzip .apkg
    const zip = new AdmZip(apkgPath);
    zip.extractAllTo(tempDir, true);

    const dbPath = fs.existsSync(path.join(tempDir, "collection.anki21"))
      ? path.join(tempDir, "collection.anki21")
      : path.join(tempDir, "collection.anki2");

    if (!fs.existsSync(dbPath)) {
      throw new Error("No collection.anki2 or collection.anki21 found in the package.");
    }

    // 3. Open Database
    const db = new Database(dbPath);

    // 4. Extract Models (to get field names)
    // In Anki databases, the 'col' table contains a 'models' column with metadata
    const colRow = db.query("SELECT models FROM col").get() as { models: string };
    const models = JSON.parse(colRow.models);
    
    const fieldMapping: Record<string, string[]> = {};
    Object.keys(models).forEach(mid => {
      fieldMapping[mid] = models[mid].flds.map((f: any) => f.name);
    });

    // 5. Extract Notes
    const notes = db.query("SELECT mid, flds, tags FROM notes").all() as { mid: number, flds: string, tags: string }[];

    const data = notes.map(note => {
      const fieldNames = fieldMapping[note.mid.toString()] || [];
      const fieldValues = note.flds.split("\x1f");
      
      const record: Record<string, string> = {};
      fieldNames.forEach((name, index) => {
        record[name] = fieldValues[index] || "";
      });
      
      return {
        ...record,
        _tags: note.tags.trim().split(/\s+/).filter(t => t),
        _modelId: note.mid
      };
    });

    // 6. Handle Media Files
    const mediaJsonPath = path.join(tempDir, "media");
    const outputMediaDir = apkgPath.replace(".apkg", "_media");
    
    if (fs.existsSync(mediaJsonPath)) {
      console.log(`\x1b[36m[AnkiExtractor]\x1b[0m Extracting media to: ${outputMediaDir}`);
      if (!fs.existsSync(outputMediaDir)) fs.mkdirSync(outputMediaDir, { recursive: true });
      
      const mediaMap = JSON.parse(fs.readFileSync(mediaJsonPath, "utf8"));
      Object.entries(mediaMap).forEach(([tempName, realName]) => {
        const src = path.join(tempDir, tempName);
        const dest = path.join(outputMediaDir, realName as string);
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, dest);
          } catch (err) {
            console.warn(`\x1b[33mWarning:\x1b[0m Could not copy ${realName}: ${err.message}`);
          }
        }
      });
      console.log(`\x1b[32m✔\x1b[0m Extracted \x1b[1m${Object.keys(mediaMap).length}\x1b[0m media files.`);
    }

    // 7. Output Result
    const outputPath = apkgPath.replace(".apkg", ".json");
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    db.close(); // IMPORTANT: Close the database to release the file lock

    console.log(`\n\x1b[32m✔ Success!\x1b[0m`);
    console.log(`Extracted \x1b[1m${data.length}\x1b[0m notes.`);
    console.log(`Saved to: \x1b[34m${outputPath}\x1b[0m`);

    // Clean up after a short delay to ensure OS has released the file
    setTimeout(() => {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        // Silently ignore cleanup errors if they still happen on Windows
      }
    }, 100);

  } catch (error: any) {
    console.error(`\x1b[31mCritical Error:\x1b[0m ${error.message}`);
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    process.exit(1);
  }
}

// CLI entry point
const inputArg = process.argv[2];
if (!inputArg) {
  console.log(`
\x1b[1mAnki Universal Extractor (Bun Edition)\x1b[0m
Usage: bun run anki-extract.ts <file.apkg>
  `);
} else {
  extractAnki(path.resolve(inputArg));
}
