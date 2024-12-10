import decompress from "decompress";
import { createWriteStream } from "fs";
import { move } from "fs-extra";
import { mkdir, readdir, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import superfetch from "superagent";
import config from "../../../config";
import mainLogger from "../../../utils/logger/main";

export const staffDocumentFolder = join(__dirname, "../../../staff-document");

const tempDirectory = join(tmpdir(), "staff-document-cloner");
const githubToken = config.staffDocumentCloningToken!;

// delete the /web/staff-document folder, then re-download it from github and unzip it
export default async function cloneStaffDocument(): Promise<void> {
  // make an empty folder if the token is not set
  if (!githubToken) return void mkdir(staffDocumentFolder, { recursive: true });
  await downloadStaffDocumentZip();
  await unpackZipAndMoveFolder();
  mainLogger.info("Staff document has been successfully re-cloned");
}

async function downloadStaffDocumentZip(): Promise<void> {
  await rm(tempDirectory, { force: true, recursive: true });
  await mkdir(tempDirectory, { recursive: true });

  return new Promise(resolve => {
    const stream = createWriteStream(join(tempDirectory, "build.zip"));
    superfetch
      .get("https://api.github.com/repos/project-blurple/staff-document/zipball/build")
      .set("User-Agent", "Blurple Hammer")
      .set("Accept", "application/vnd.github+json")
      .set("Authorization", `Bearer ${githubToken}`)
      .set("X-GitHub-Api-Version", "2022-11-28")
      .redirects(1)
      .pipe(stream)
      .on("close", () => resolve(stream.close()));
  });
}

async function unpackZipAndMoveFolder(): Promise<void> {
  await decompress(join(tempDirectory, "build.zip"), join(tempDirectory, "buildBundle"));
  const [folder] = await readdir(join(tempDirectory, "buildBundle")) as [string];
  await rm(staffDocumentFolder, { force: true, recursive: true });
  await move(join(tempDirectory, "buildBundle", folder), staffDocumentFolder);
}

void cloneStaffDocument();
