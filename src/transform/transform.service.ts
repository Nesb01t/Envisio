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
    const result = await promisify(exec)(transformCommand);
    console.log(result);

    const outputFile = new File(
      [await promisify(readFile)(outputFilePath)],
      outputName,
    );
    return outputFile;
  }

  async schemToSchematic(file: Express.Multer.File): Promise<File> {
    const originalName = file.originalname;
    const outputName = `${originalName}`.replace('.schem', '.schematic');

    const originalFilePath = getTempFilePath(originalName);
    const outputFilePath = getTempFilePath(outputName);

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

  async schematicToObj(file: Express.Multer.File): Promise<File> {
    const originalName = file.originalname;
    const outputName = `${originalName}`.replace('.schematic', '.obj');

    const originalFilePath = join(__dirname, '..', '..', 'tmp', originalName);
    const outputFilePath = join(__dirname, '..', '..', 'tmp', outputName);
    const minecraftRootFolderPath = join(__dirname, '..', '..', '.minecraft');

    // write file to filesystem
    await promisify(writeFile)(originalFilePath, file.buffer);

    // transform and output schem file
    const transformCommand = `java -jar ${getSchem2ObjJarPath()} -minecraftFolder ${minecraftRootFolderPath} -i ${originalFilePath} -o ${outputFilePath}`;
    const result = await promisify(exec)(transformCommand);
    console.log(result);

    const outputFile = new File(
      [await promisify(readFile)(outputFilePath)],
      outputName,
    );
    return outputFile;
  }

  async cleanupFile(file: File | Express.Multer.File) {
    const fileName = 'name' in file ? file.name : file.originalname;
    const filePath = join(__dirname, '..', '..', 'tmp', fileName);
    await promisify(unlink)(filePath);
  }
}

const getLite2EditJarPath = () => {
  return join(__dirname, '..', '..', 'external', 'Lite2Edit.jar');
};

const getSchem2ObjJarPath = () => {
  return join(__dirname, '..', '..', 'external', 'schem2obj.jar');
};

export const getTempFilePath = (fileName: string) => {
  return join(__dirname, '..', '..', 'tmp', fileName);
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
