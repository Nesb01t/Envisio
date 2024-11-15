import { blocksNamespace } from './blocknamespace';

const nbt = require('./nbt.js');
const zlib = require('zlib');
export function schemToSchematic(arrayBuffer, callback) {
  // Move the width/length/height data to the old location
  function moveSize(root) {
    if ('Schematic' in root.value && 'Width' in root.value.Schematic.value) {
      root.value.Width = root.value.Schematic.value.Width;
      root.value.Length = root.value.Schematic.value.Length;
      root.value.Height = root.value.Schematic.value.Height;

      delete root.value.Schematic.value.Width;
      delete root.value.Schematic.value.Length;
      delete root.value.Schematic.value.Height;
    }
  }

  // Move the schematic offset data to the old location
  function moveOffset(root) {
    if ('Schematic' in root.value && 'Offset' in root.value.Schematic.value) {
      root.value.WEOffsetX = {
        type: 'int',
        value: root.value.Schematic.value.Offset.value[0],
      };
      root.value.WEOffsetY = {
        type: 'int',
        value: root.value.Schematic.value.Offset.value[1],
      };
      root.value.WEOffsetZ = {
        type: 'int',
        value: root.value.Schematic.value.Offset.value[2],
      };
      delete root.value.Schematic.value.Offset;
    }

    if ('Metadata' in root.value && 'WEOffsetX' in root.value.Metadata.value) {
      root.value.WEOffsetX = root.value.Metadata.value.WEOffsetX;
      root.value.WEOffsetY = root.value.Metadata.value.WEOffsetY;
      root.value.WEOffsetZ = root.value.Metadata.value.WEOffsetZ;

      delete root.value.Metadata;
    }
  }

  // Move the schematic origin data to the old location
  function moveOrigin(root) {
    if (
      'Schematic' in root.value &&
      'Metadata' in root.value.Schematic.value &&
      'WorldEdit' in root.value.Schematic.value.Metadata.value &&
      'Origin' in root.value.Schematic.value.Metadata.value.WorldEdit.value
    ) {
      root.value.WEOriginX = {
        type: 'int',
        value:
          root.value.Schematic.value.Metadata.value.WorldEdit.value.Origin
            .value[0],
      };
      root.value.WEOriginY = {
        type: 'int',
        value:
          root.value.Schematic.value.Metadata.value.WorldEdit.value.Origin
            .value[1],
      };
      root.value.WEOriginZ = {
        type: 'int',
        value:
          root.value.Schematic.value.Metadata.value.WorldEdit.value.Origin
            .value[2],
      };

      // Add the offset to the origin
      if ('WEOffsetX' in root.value) {
        root.value.WEOriginX.value += root.value.WEOffsetX.value;
        root.value.WEOriginY.value += root.value.WEOffsetY.value;
        root.value.WEOriginZ.value += root.value.WEOffsetZ.value;
      }

      delete root.value.Schematic.value.Metadata.value.WorldEdit.value.Origin;
    }

    if ('Offset' in root.value) {
      root.value.WEOriginX = { type: 'int', value: root.value.Offset.value[0] };
      root.value.WEOriginY = { type: 'int', value: root.value.Offset.value[1] };
      root.value.WEOriginZ = { type: 'int', value: root.value.Offset.value[2] };

      delete root.value.Offset;
    }
  }

  // Set the schematic materials type
  function setMaterials(root) {
    root.value.Materials = { type: 'string', value: 'Alpha' };
  }

  // Move the tile entites to the old location and modify their position and id data
  function moveTileEntities(root) {
    if (
      'Schematic' in root.value &&
      'Blocks' in root.value.Schematic.value &&
      'BlockEntities' in root.value.Schematic.value.Blocks.value
    ) {
      root.value.BlockEntities =
        root.value.Schematic.value.Blocks.value.BlockEntities;
      delete root.value.Schematic.value.Blocks.value.BlockEntities;
    }

    if ('BlockEntities' in root.value) {
      root.value.TileEntities = root.value.BlockEntities;
      delete root.value.BlockEntities;

      for (let i = 0; i < root.value.TileEntities.length; i++) {
        const tileEntity = root.value.TileEntities[i];

        if ('Pos' in tileEntity.value) {
          tileEntity.value.x = {
            type: 'int',
            value: tileEntity.value.Pos.value[0],
          };
          tileEntity.value.y = {
            type: 'int',
            value: tileEntity.value.Pos.value[1],
          };
          tileEntity.value.z = {
            type: 'int',
            value: tileEntity.value.Pos.value[2],
          };

          delete tileEntity.value.Pos;
        }

        if ('Id' in tileEntity.value) {
          tileEntity.value.id = tileEntity.value.Id;

          delete tileEntity.value.Id;
        }
      }
    }
  }

  function convertToLegacyBlockId(namespaceKey) {
    if (namespaceKey in blocksNamespace) {
      return blocksNamespace[namespaceKey];
    }

    // Not in the table, try to find a match
    const originalKey = namespaceKey;
    let index = 0;

    if (~(index = namespaceKey.indexOf('shape='))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'shape=straight' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('smooth_stone_slab'))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'stone_slab' +
        namespaceKey.substr(namespaceKey.indexOf('[', index));
    }

    if (~(index = namespaceKey.indexOf('_wall_sign'))) {
      namespaceKey =
        'minecraft:wall_sign' +
        namespaceKey.substr(namespaceKey.indexOf('[', index));
    }

    if (
      !~namespaceKey.indexOf('wall_sign') &&
      ~(index = namespaceKey.indexOf('_sign'))
    ) {
      namespaceKey =
        'minecraft:sign' +
        namespaceKey.substr(namespaceKey.indexOf('[', index));
    }

    if (~(index = namespaceKey.indexOf('_wall_banner'))) {
      namespaceKey =
        'minecraft:white_wall_banner' +
        namespaceKey.substr(namespaceKey.indexOf('[', index));
    }

    if (
      !~namespaceKey.indexOf('wall_banner') &&
      ~(index = namespaceKey.indexOf('_banner'))
    ) {
      namespaceKey =
        'minecraft:white_banner' +
        namespaceKey.substr(namespaceKey.indexOf('[', index));
    }

    if (~(index = namespaceKey.indexOf('_bed'))) {
      namespaceKey =
        'minecraft:red_bed' +
        namespaceKey.substr(namespaceKey.indexOf('[', index));
    }

    if (~(index = namespaceKey.indexOf('_wall_head'))) {
      namespaceKey =
        'minecraft:skeleton_wall_skull' +
        namespaceKey.substr(namespaceKey.indexOf('[', index));
    }

    if (
      !~(index = namespaceKey.indexOf('_wall_head')) &&
      ~(index = namespaceKey.indexOf('_head'))
    ) {
      namespaceKey =
        'minecraft:skeleton_skull' +
        namespaceKey.substr(namespaceKey.indexOf('[', index));
    }

    if (~(index = namespaceKey.indexOf('east='))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'east=false' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('north='))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'north=false' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('south='))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'south=false' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('west='))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'west=false' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('distance='))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'distance=1' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (
      ~(index = namespaceKey.indexOf('type=left')) ||
      ~(index = namespaceKey.indexOf('type=right'))
    ) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'type=single' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('waterlogged=true'))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'waterlogged=false' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('snowy=true'))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'snowy=false' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('in_wall=true'))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'in_wall=false' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (namespaceKey in blocksNamespace) {
      return blocksNamespace[namespaceKey];
    }

    if (~(index = namespaceKey.indexOf('up=false'))) {
      const tempkey =
        namespaceKey.substr(0, index) +
        'up=true' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));

      if (tempkey in blocksNamespace) {
        return blocksNamespace[tempkey];
      }
    }

    if (~(index = namespaceKey.indexOf('up=true'))) {
      const tempkey =
        namespaceKey.substr(0, index) +
        'up=false' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));

      if (tempkey in blocksNamespace) {
        return blocksNamespace[tempkey];
      }
    }

    if (
      ~(index = namespaceKey.indexOf('axis=x')) ||
      ~(index = namespaceKey.indexOf('axis=z'))
    ) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'axis=y' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('east=false'))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'east=none' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('north=false'))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'north=none' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('south=false'))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'south=none' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('west=false'))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'west=none' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (~(index = namespaceKey.indexOf('rotation='))) {
      namespaceKey =
        namespaceKey.substr(0, index) +
        'rotation=0' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));
    }

    if (namespaceKey in blocksNamespace) {
      return blocksNamespace[namespaceKey];
    }

    if (
      false &&
      ~(index = namespaceKey.indexOf('facing=')) &&
      ~namespaceKey.indexOf('hinge=')
    ) {
      const tempkey =
        namespaceKey.substr(0, index) +
        'facing=east' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));

      if (~(index = tempkey.indexOf('open=true'))) {
        tempkey =
          tempkey.substr(0, index) +
          'open=false' +
          tempkey.substr(namespaceKey.indexOf(',', index));
      }

      if (tempkey in blocksNamespace) {
        return blocksNamespace[tempkey];
      }

      const index = namespaceKey.indexOf('hinge=');

      tempkey =
        namespaceKey.substr(0, index) +
        'hinge=right' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));

      if (tempkey in blocksNamespace) {
        return blocksNamespace[tempkey];
      }
    }

    if (~(index = namespaceKey.indexOf('facing=east'))) {
      const tempkey =
        namespaceKey.substr(0, index) +
        'facing=west' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));

      if (tempkey in blocksNamespace) {
        return blocksNamespace[tempkey];
      }
    }

    if (~(index = namespaceKey.indexOf('facing='))) {
      const tempkey =
        namespaceKey.substr(0, index) +
        'facing=north' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));

      if (tempkey in blocksNamespace) {
        return blocksNamespace[tempkey];
      }
    }

    if (~(index = namespaceKey.indexOf('half=upper'))) {
      const tempkey =
        namespaceKey.substr(0, index) +
        'half=lower' +
        namespaceKey.substr(namespaceKey.indexOf(',', index));

      if (tempkey in blocksNamespace) {
        return blocksNamespace[tempkey];
      }
    }

    if (~(index = originalKey.indexOf('powered=true'))) {
      const tempkey =
        originalKey.substr(0, index) +
        'powered=false' +
        originalKey.substr(originalKey.indexOf(',', index));

      return convertToLegacyBlockId(tempkey);
    }

    if (~(index = namespaceKey.indexOf('waterlogged='))) {
      const tempkey =
        namespaceKey.substr(0, index - 1) +
        namespaceKey.substr(namespaceKey.indexOf(',', index));

      if (tempkey in blocksNamespace) {
        return blocksNamespace[tempkey];
      }
    }

    // How about no block states?
    if (~(index = originalKey.indexOf('['))) {
      const tempkey = originalKey.substr(0, index);

      if (tempkey in blocksNamespace) {
        return blocksNamespace[tempkey];
      }
    }

    const error =
      'Unknown namespace key: ' + originalKey + ', replacing with air.';

    console.log(error);
    return 0;
  }

  // Convert the block data to the legacy blocks and data
  function convertBlockData(root) {
    if (
      'Schematic' in root.value &&
      'Blocks' in root.value.Schematic.value &&
      'Data' in root.value.Schematic.value.Blocks.value
    ) {
      root.value.Palette = root.value.Schematic.value.Blocks.value.Palette;
      root.value.BlockData = root.value.Schematic.value.Blocks.value.Data;
      delete root.value.Schematic.value.Blocks.value.Palette;
      delete root.value.Schematic.value.Blocks.value.Data;
    }

    if ('Palette' in root.value && 'BlockData' in root.value) {
      const palette = [];

      for (const key in root.value.Palette.value) {
        palette[root.value.Palette.value[key].value] = key;
      }

      const blockdata = root.value.BlockData.value;
      const blocks = [];
      const data = [];
      let varInt = 0;
      let varIntLength = 0;
      let blockId;

      for (let i = 0; i < blockdata.length; i++) {
        varInt |= (blockdata[i] & 127) << (varIntLength++ * 7);

        if ((blockdata[i] & 128) == 128) {
          continue;
        }

        blockId = convertToLegacyBlockId(palette[varInt]);

        blocks.push(blockId >> 4);
        data.push(blockId & 0xf);

        varIntLength = 0;
        varInt = 0;
      }

      root.value.Blocks = { type: 'byteArray', value: blocks };
      root.value.Data = { type: 'byteArray', value: data };
      delete root.value.BlockData;
    }
  }

  nbt.parse(arrayBuffer, function (error, root) {
    if (error) {
      throw error;
    }

    if ('Schematic' in root.value) {
      root.name = 'Schematic';
    }

    moveSize(root);
    moveOffset(root);
    moveOrigin(root);
    setMaterials(root);
    moveTileEntities(root);
    convertBlockData(root);

    zlib.gzip(
      new Uint8Array(nbt.writeUncompressed(root)),
      function (error, data) {
        if (error) {
          throw error;
        }

        callback(data);
      },
    );
  });
}

module.exports = { schemToSchematic };
