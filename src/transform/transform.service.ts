import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { readFile, unlink, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const {
  schemToSchematic,
} = require('../utils/schem2schematic/schemtoschematic.js');

@Injectable()
export class TransformService {
  async litematicToSchem(file: Express.Multer.File): Promise<File> {
    const originalName = file.originalname;
    const outputName = `${originalName}`.replace('.litematic', '.schem');

    const originalFilePath = join(__dirname, '..', '..', 'tmp', originalName);
    const outputFilePath = join(__dirname, '..', '..', 'tmp', outputName);

    // write file to filesystem
    await promisify(writeFile)(originalFilePath, file.buffer);

    // transform and output schem file
    const transformCommand = `java -jar ${getLite2EditJarPath()} --convert ${originalFilePath}`;
    await promisify(exec)(transformCommand);

    const outputFile = new File(
      [await promisify(readFile)(outputFilePath)],
      outputName,
    );
    return outputFile;
  }

  async schemToSchematic(file: Express.Multer.File): Promise<File> {
    const originalName = file.originalname;
    const outputName = `${originalName}`.replace('.schem', '.schematic');

    const originalFilePath = join(__dirname, '..', '..', 'tmp', originalName);
    const outputFilePath = join(__dirname, '..', '..', 'tmp', outputName);

    // write file to filesystem
    await promisify(writeFile)(originalFilePath, file.buffer);

    // tranform and output schematic file
    const originalBuffer = await promisify(readFile)(originalFilePath);
    const resultBuffer = await promisifySchemToSchematic(originalBuffer);
    await promisify(writeFile)(outputFilePath, resultBuffer);

    const outputFile = new File(
      [await promisify(readFile)(outputFilePath)],
      outputName,
    );
    return outputFile;
  }

  async cleanupFile(file: File) {
    const filePath = join(__dirname, '..', '..', 'tmp', file.name);
    await promisify(unlink)(filePath);
  }
}

const getLite2EditJarPath = () => {
  return join(__dirname, '..', '..', 'external', 'Lite2Edit.jar');
};

async function promisifySchemToSchematic(
  arrayBuffer: ArrayBuffer,
): Promise<any> {
  return new Promise((resolve) => {
    schemToSchematic(arrayBuffer, (result) => {
      resolve(result);
    });
  });
}
